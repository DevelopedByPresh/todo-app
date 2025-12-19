# ToDo App - React Native

A modern, feature-rich **ToDo app** built with **React Native** and **Expo**, supporting task management, voice input, and persistent storage.

---

## Features

- Add, update, and delete tasks  
- Mark tasks as completed or uncompleted  
- Filter tasks by **All**, **Completed**, or **Uncompleted**  
- Search tasks by title  
- Voice input via **OpenAI Whisper**  
- Light and dark theme toggle  
- Persistent storage with **AsyncStorage**  
- Responsive, mobile-friendly UI  

---

## Screens

1. **Onboarding Screen** – Welcome screen with logo  
2. **Todo List Screen** – View and manage tasks, filter, search, and toggle theme  
3. **Add Todo Screen** – Add tasks manually or via voice  

---

## Tech Stack

- **Frontend:** React Native, Expo  
- **State Management:** useState, useEffect, useFocusEffect  
- **Storage:** AsyncStorage  
- **Navigation:** React Navigation (Stack Navigator)  
- **Icons:** Expo Vector Icons (AntDesign, Feather, Entypo, MaterialIcons, FontAwesome)  
- **Voice Input:** Expo Audio + OpenAI Whisper API  
- **Notifications:** react-native-toast-message  

---

## Installation

```bash
git clone https://github.com/DevelopedByPresh/todo-app.git
npm install  # or yarn install
expo start or npm start
