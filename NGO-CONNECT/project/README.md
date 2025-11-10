# NGO Connect Platform

A comprehensive national NGO Connect platform built with Python Flask, HTML, and CSS that connects NGOs, volunteers, and donors to create positive change in communities.

## 🌟 Features

### Core Platform Features
- **Multi-role User System**: Support for NGOs, Volunteers, Donors, and Admins
- **2-Hour Time Slot Booking**: Flexible volunteer scheduling system
- **Skills-based Matching**: Smart algorithm to match volunteers with opportunities
- **Real-time Communication**: Built-in messaging system with Socket.IO
- **Comprehensive Analytics**: Detailed reporting and impact tracking

### NGO Features
- Profile creation and management
- Event/opportunity listing with time slot management
- Volunteer engagement tracking
- Resource sharing capabilities
- Project tracking and progress monitoring

### Volunteer Features
- Registration with skills and interests selection
- Opportunity browsing and filtering
- 2-hour slot booking system
- Impact tracking and leaderboard
- Achievement system with certificates

### Donor Features
- Donation management and tracking
- NGO discovery and evaluation
- Impact visualization
- Donation history and certificates

### Admin Features
- Platform oversight and user management
- NGO verification system
- Analytics and reporting dashboard
- System configuration and monitoring

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ngo-connect-platform
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   SECRET_KEY=your-secret-key-here
   MONGODB_URI=mongodb://localhost:27017/ngo-connect
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   CLIENT_URL=http://localhost:3000
   ```

5. **Initialize the database**
   ```bash
   python app.py
   ```
   The database will be automatically created on first run.

6. **Run the application**
   ```bash
   python app.py
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## 📁 Project Structure

```
ngo-connect-platform/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
├── templates/            # HTML templates
│   ├── base.html         # Base template with navigation
│   ├── index.html        # Landing page
│   ├── register.html     # User registration
│   ├── login.html        # User login
│   ├── admin/            # Admin dashboard templates
│   ├── ngo/              # NGO dashboard templates
│   ├── volunteer/        # Volunteer dashboard templates
│   └── donor/            # Donor dashboard templates
├── static/               # Static files (CSS, JS, images)
│   └── uploads/          # File uploads
└── instance/             # Instance folder for application data
```

## 🎯 Key Features Explained

### 2-Hour Time Slot System
- NGOs can create events with multiple 2-hour time slots
- Volunteers can book specific slots based on their availability
- Real-time availability tracking prevents double bookings
- Automatic slot management and status updates

### Skills-based Matching
- Volunteers register with specific skills and interests
- NGOs can specify required skills for events
- Platform recommends opportunities based on skill matches
- Smart filtering and search functionality

### Communication System
- Real-time messaging between users
- Socket.IO integration for instant updates
- Message history and notifications
- File sharing capabilities

### Analytics and Reporting
- Comprehensive dashboard for each user type
- Impact tracking and visualization
- Volunteer hours and points system
- Donation tracking and reporting

## 🔧 Configuration

### Database Configuration
The application requires a database connection. Configure your database:

1. Set the `DATABASE_URL` in your `.env` file
2. For PostgreSQL: `postgresql://user:password@localhost/dbname`
3. For MySQL: `mysql://user:password@localhost/dbname`

### Email Configuration
Configure email settings in `app.py`:
```python
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your-email@gmail.com'
app.config['MAIL_PASSWORD'] = 'your-app-password'
```

### File Upload Configuration
Update upload settings in `app.py`:
```python
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
```

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production Deployment
1. **Using Gunicorn**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Using Docker**
   ```dockerfile
   FROM python:3.9-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   EXPOSE 5000
   CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
   ```

## 🔒 Security Features

- Password hashing with bcrypt
- CSRF protection
- Rate limiting
- Input validation and sanitization
- Secure file upload handling
- Session management

## 📊 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /logout` - User logout

### Events
- `GET /api/events` - Get all events
- `GET /api/events/<id>/slots` - Get event time slots
- `POST /api/book-slot` - Book a time slot

### Real-time Communication
- Socket.IO events for messaging
- Room-based chat system
- Real-time notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@ngoconnect.com
- Documentation: [Link to documentation]
- Issues: [GitHub Issues page]

## 🎉 Acknowledgments

- Flask community for the excellent web framework
- Font Awesome for the beautiful icons
- Inter font family for typography
- All contributors and volunteers who helped build this platform

---

**Made with ❤️ for the community**

 





