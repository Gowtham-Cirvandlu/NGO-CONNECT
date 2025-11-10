(function(){
  var meta = document.getElementById('donateMeta');
  if(!meta) return;

  function buildUpiLink() {
    var upiId = meta.dataset.upiId || '';
    var upiName = meta.dataset.upiName || '';
    var amtInput = document.getElementById('amount_inr');
    var msgInput = document.getElementById('message');
    var amount = (amtInput && amtInput.value) ? parseFloat(amtInput.value) : null;
    var note = (msgInput && msgInput.value) ? msgInput.value : (meta.dataset.message || 'Donation');

    var params = new URLSearchParams();
    if (upiId) params.set('pa', upiId); // payee address
    if (upiName) params.set('pn', upiName); // payee name
    if (amount && amount > 0) params.set('am', amount.toFixed(2)); // amount
    params.set('cu', 'INR'); // currency
    if (note) params.set('tn', note.slice(0, 40)); // transaction note (short)

    return 'upi://pay?' + params.toString();
  }

  function ensureStatusNode() {
    var existing = document.getElementById('upiQrStatus');
    if (existing) return existing;
    var qrImg = document.getElementById('upiQrImg');
    if (!qrImg || !qrImg.parentElement) return null;
    var span = document.createElement('small');
    span.id = 'upiQrStatus';
    span.className = 'text-muted';
    span.style.display = 'block';
    span.style.marginTop = '.25rem';
    qrImg.parentElement.appendChild(span);
    return span;
  }

  function renderUpiQr() {
    var upiUrl = buildUpiLink();
    var qrImg = document.getElementById('upiQrImg');
    var link = document.getElementById('upiLink');
    var statusNode = ensureStatusNode();
    if (link) link.href = upiUrl;
    if (!qrImg) return;
    var enc = encodeURIComponent(upiUrl);

    // Try multiple providers with fallback
    var providers = [
      'https://api.qrserver.com/v1/create-qr-code/?data='+enc+'&size=220x220&margin=2',
      'https://quickchart.io/qr?text='+enc+'&size=220&margin=2',
      'https://api.qrserver.com/v1/create-qr-code/?format=svg&data='+enc+'&size=220x220&margin=2'
    ];

    var idx = 0;
    function tryNext() {
      if (idx >= providers.length) {
        if (statusNode) statusNode.textContent = 'Could not load QR image. Click "Pay in UPI App" or try reloading.';
        return;
      }
      var url = providers[idx++];
      if (statusNode) statusNode.textContent = 'Generating QR…';
      // Detach previous handlers
      qrImg.onerror = null; qrImg.onload = null;
      qrImg.onerror = function(){ tryNext(); };
      qrImg.onload = function(){ if (statusNode) statusNode.textContent = ''; };
      qrImg.src = url;
    }
    tryNext();
  }

  // Initial QR/link render
  if (meta.dataset.upiId) {
    // Prefill amount and message from data attributes if present
    try {
      var amt = meta.dataset.amount;
      if (amt) { var amtEl = document.getElementById('amount_inr'); if (amtEl && !amtEl.value) amtEl.value = amt; }
      var msg = meta.dataset.message;
      if (msg) { var msgEl = document.getElementById('message'); if (msgEl && !msgEl.value) msgEl.value = msg; }
    } catch (e) {}
    renderUpiQr();
    // Update QR when amount or message changes
    var amtEl2 = document.getElementById('amount_inr');
    var msgEl2 = document.getElementById('message');
    if (amtEl2) amtEl2.addEventListener('input', renderUpiQr);
    if (msgEl2) msgEl2.addEventListener('input', renderUpiQr);
  }

  // Amount tiles behavior
  (function bindAmountTiles(){
    var tiles = Array.prototype.slice.call(document.querySelectorAll('.amount-grid .amount'));
    var amtInput = document.getElementById('amount_inr');
    function setActive(tile){ tiles.forEach(function(t){ t.classList.remove('active'); }); if(tile) tile.classList.add('active'); }
    tiles.forEach(function(btn){
      btn.addEventListener('click', function(){
        try {
          var text = (btn.textContent || '').replace(/[^0-9.]/g,'');
          var val = parseFloat(text);
          if (!isNaN(val) && amtInput) { amtInput.value = val; renderUpiQr(); setActive(btn); }
        } catch(e) {}
      });
    });
    if (amtInput) {
      amtInput.addEventListener('focus', function(){ setActive(null); });
      amtInput.addEventListener('input', function(){ setActive(null); renderUpiQr(); });
    }
  })();

  async function confirmDonation(){
    var api = meta.dataset.api;
    var csrf = meta.dataset.csrf;
    var ngoId = meta.dataset.ngoId ? parseInt(meta.dataset.ngoId,10) : null;
    var amtEl = document.getElementById('amount_inr');
    var msgEl = document.getElementById('message');
    var anonEl = document.getElementById('anonymous');
    var refEl = document.getElementById('upi_reference');
    var btn = document.getElementById('donateConfirm');

    var amt = parseFloat((amtEl && amtEl.value) ? amtEl.value : 0);
    var msg = msgEl ? (msgEl.value || '') : '';
    var anon = !!(anonEl && anonEl.checked);
    var ref = refEl ? ((refEl.value || '').trim()) : '';

    // Basic validation
    if (!ngoId) { alert('Please select an NGO from the dashboard and try again.'); return; }
    if (!amt || amt < 1) { if (amtEl) amtEl.focus(); alert('Please enter a valid amount (₹1 or more).'); return; }

    // Non-blocking reminder if no UPI reference provided
    if (!ref) {
      var proceed = confirm('You have not entered a UPI reference. You can still record the donation, but verification may be delayed. Continue?');
      if (!proceed) return;
    }

    // Prevent double submit
    if (btn) { btn.disabled = true; btn.dataset.prevText = btn.textContent; btn.textContent = 'Recording...'; }
    try {
      var payload = { ngo_id: ngoId, amount_inr: amt, message: msg, anonymous: anon, upi_reference: ref };
      var res = await fetch(api, { method:'POST', headers:{ 'Content-Type':'application/json', 'X-CSRFToken': csrf }, body: JSON.stringify(payload) });
      var data = {};
      try { data = await res.json(); } catch(e) {}
      if(res.ok && data && data.donation_id){
        alert('Donation recorded. ID: '+data.donation_id);
        window.location.href = meta.dataset.back;
      } else {
        alert((data && data.error) ? data.error : 'Failed to record donation. Please try again.');
      }
    } catch (err) {
      alert('Network error while recording donation. Please check your internet and try again.');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = btn.dataset.prevText || 'Confirm Donation'; }
    }
  }
  var btn = document.getElementById('donateConfirm');
  if(btn) btn.addEventListener('click', function(e){ e.preventDefault(); confirmDonation(); });
})();
