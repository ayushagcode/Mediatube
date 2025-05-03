# 🎥 MediaTube - Video Sharing Platform

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

</div>

## 📝 Description

MediaTube is a modern, full-stack video sharing platform that allows users to upload, watch, and interact with videos. Built with scalability and security in mind, it provides a seamless experience for content creators and viewers alike.

## ✨ Features

### 👤 User Management
- **🔐 Authentication**
  - ✍️ User registration with email and username
  - 🔑 Secure login system with JWT tokens
  - 🔄 Password change functionality
  - 🚪 Secure logout system
  - 🔄 Token refresh mechanism

- **👤 Profile Management**
  - 🖼️ Profile picture (avatar) and cover image upload
  - 📝 Profile information update
  - 🗑️ Account deletion
  - 🔒 Secure password management

### 🛡️ Security Features
- 🔐 JWT-based authentication
- 🔑 Password hashing using bcrypt
- ✅ Input validation and sanitization
- 🍪 Secure cookie handling
- ⚠️ Error handling middleware
- 🚫 Rate limiting and request validation

### 📦 Media Management
- ☁️ Cloudinary integration for media storage
- 🖼️ Avatar and cover image upload
- 🔒 Secure file handling
- 🗑️ Media deletion on account removal

## 🛠️ Technical Stack

| Category | Technologies |
|----------|--------------|
| Backend Framework | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) |
| Database | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) |
| Authentication | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=JSON%20web%20tokens&logoColor=white) |
| File Storage | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white) |
| Security | ![bcrypt](https://img.shields.io/badge/bcrypt-000000?style=flat&logo=bcrypt&logoColor=white) |

## 🔌 API Endpoints

### User Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/users/register` | Register a new user |
| `POST` | `/api/v1/users/login` | User login |
| `POST` | `/api/v1/users/logout` | User logout |
| `POST` | `/api/v1/users/refresh-token` | Refresh access token |
| `GET` | `/api/v1/users/get-current-user` | Get current user details |
| `PATCH` | `/api/v1/users/update-account` | Update user account details |
| `PATCH` | `/api/v1/users/update-user-images` | Update user profile images |
| `POST` | `/api/v1/users/change-password` | Change user password |
| `DELETE` | `/api/v1/users/delete-account` | Delete user account |

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mediatube.git
   cd mediatube
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_uri
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=your_access_token_expiry
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

[Ayush Agarwal](https://github.com/ayushagcode)

---

<div align="center">
  
[![GitHub stars](https://img.shields.io/github/stars/yourusername/mediatube?style=social)](https://github.com/yourusername/mediatube/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/mediatube?style=social)](https://github.com/yourusername/mediatube/network)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/mediatube)](https://github.com/yourusername/mediatube/issues)
[![GitHub license](https://img.shields.io/github/license/yourusername/mediatube)](https://github.com/yourusername/mediatube/blob/main/LICENSE)

</div>

