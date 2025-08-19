# Taskify - Task Management System

A mobile application for task management with Django backend and React Native frontend.

## 🚀 Technologies

### Backend
- **Django 5.2** - web framework
- **Django REST Framework** - API
- **SQLite** - database (for development)
- **JWT** - authentication

### Frontend
- **React Native** - mobile development
- **Expo** - React Native platform
- **TypeScript** - type safety
- **React Navigation** - navigation
- **React Native Paper** - UI components

## 📱 Features

### ✅ Implemented
- 🔐 **Authentication**: user registration and login
- 📋 **Task Management**: create, view, complete, delete tasks
- 👥 **Users**: display task senders and recipients
- 📊 **Statistics**: task counts by status
- 🔄 **Refresh**: pull-to-refresh on all screens
- 📱 **Responsive Design**: modern UI with gradients

### 🚧 In Development
- ✏️ Task editing
- 📎 File uploads
- 🔔 Push notifications

## 🛠️ Installation and Setup

### Backend (Django)

1. **Navigate to the project root:**
```bash
cd Taskify
```

2. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

3. **Apply migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

4. **Create superuser:**
```bash
python manage.py createsuperuser
```

5. **Populate database with test data:**
```bash
python populatedb.py
```

6. **Start the server:**
```bash
python manage.py runserver 0.0.0.0:8000
```

### Frontend (React Native)

1. **Navigate to the mobile app folder:**
```bash
cd Frontend/Mobile
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the application:**
```bash
npm start
```

4. **Scan the QR code in Expo Go** or press `a` for Android emulator

## 🔑 Test Accounts

After running `populatedb.py`, the following accounts will be created:

| Email | Password | First Name | Last Name |
|-------|----------|------------|-----------|
| `admin@test.com` | `Admin123!` | Administrator | System |
| `ivan@test.com` | `Ivan123!` | Ivan | Petrov |
| `maria@test.com` | `Maria123!` | Maria | Sidorova |
| `alex@test.com` | `Alex123!` | Alexey | Kozlov |
| `anna@test.com` | `Anna123!` | Anna | Novikova |

## 📱 API Endpoints

### Authentication
- `POST /users/register/` - user registration
- `POST /users/token/` - login (get token)
- `POST /users/token/refresh/` - refresh token

### Tasks
- `GET /tasks/tasks/` - all tasks
- `GET /tasks/my-tasks/` - my tasks (assigned to me)
- `GET /tasks/created-tasks/` - tasks created by me
- `POST /tasks/created-tasks/` - create task
- `GET /tasks/completed/` - completed tasks
- `PUT /tasks/tasks/{id}/` - update task
- `DELETE /tasks/tasks/{id}/` - delete task
- `POST /tasks/tasks/{id}/complete/` - complete task

## 🏗️ Project Structure

```
Taskify/
├── main/                    # Django app for tasks
│   ├── models.py           # Task, TaskFile models
│   ├── views.py            # API views
│   ├── serializers.py      # Serializers
│   └── urls.py             # URL routes
├── users/                   # Django app for users
│   ├── models.py           # User model
│   ├── views.py            # Authentication
│   └── serializers.py      # User serializers
├── Frontend/
│   └── Mobile/             # React Native app
│       ├── src/
│       │   ├── contexts/   # React Context (Auth, Tasks)
│       │   ├── navigation/ # Navigation
│       │   ├── screens/    # App screens
│       │   └── services/   # API services
│       └── package.json    # Dependencies
├── populatedb.py           # Database seeding script
└── manage.py               # Django management
```

## 🧭 Navigation

### Auth Navigator
- **LoginScreen** - system login
- **RegisterScreen** - user registration

### Main Navigator (Tab)
- **HomeScreen** - main page with overview
- **MyTasksScreen** - tasks assigned to me
- **CreatedTasksScreen** - tasks created by me
- **CompletedTasksScreen** - completed tasks
- **ProfileScreen** - user profile

## 🚀 Deployment

### Testing
- **Expo Go** - for device testing
- **Android Emulator** - for development

### Building
- **EAS Build** - for creating APK/IPA
- **Expo Application Services** - for deployment

## 🔧 Configuration

### IP Address
In `Frontend/Mobile/src/services/api.ts`, change `BASE_URL` to your IP:
```typescript
const BASE_URL = 'http://192.168.1.70:8000';
```

### Database
For production, replace SQLite with PostgreSQL or MySQL in `settings.py`.

## 🐛 Troubleshooting

### Error "Text strings must be rendered within a <Text> component"
- Ensure all text strings are wrapped in `<Text>` components
- Check that emojis are also wrapped in `<Text>`

### Error "no such table: main_task"
- Run migrations: `python manage.py migrate`

### npm install issues
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Authentication errors
- Check that Django server is running
- Verify IP address is correct
- Ensure user exists in database

## 📞 Support

If you encounter issues:
1. Check Django server logs
2. Check React Native console
3. Ensure all dependencies are installed
4. Verify network settings and IP addresses

## 📄 License

MIT License - free use and modification.

## 🌟 Key Features

### Task Management
- Create tasks with descriptions
- Assign tasks to users
- Mark tasks as complete
- Delete tasks
- View task history

### User Interface
- Modern gradient design
- Responsive layout
- Pull-to-refresh functionality
- Status indicators with emojis
- Priority-based task coloring

### Data Persistence
- JWT token authentication
- Secure token storage
- Automatic token refresh
- Persistent user sessions

## 🔒 Security Features

- JWT-based authentication
- Password validation (8+ chars, uppercase, lowercase, numbers, special chars)
- Secure token storage
- User permission checks

## 📱 Mobile Features

- Cross-platform compatibility
- Offline-first design
- Smooth animations
- Native performance
- Expo Go compatibility

## 🚀 Getting Started Quickly

1. **Clone the repository**
2. **Run backend setup** (Django)
3. **Run frontend setup** (React Native)
4. **Populate database** with test data
5. **Start both services**
6. **Test with Expo Go**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📈 Future Roadmap

- Task editing functionality
- File attachment support
- Push notifications
- Team collaboration features
- Advanced reporting
- Mobile app store deployment
