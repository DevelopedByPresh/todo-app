import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
  Pressable,
  FlatList,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");
import { moderateScale } from "react-native-size-matters";

const lightTheme = {
  background: "#FFFFFF",
  text: "#000000",
  card: "#FFFFFF",
  searchBG: "#F5F5F5",
  border: "#DDD",
  icon: "#000",
};

const darkTheme = {
  background: "#000000",
  text: "#FFFFFF",
  card: "#3f3f3fff",
  searchBG: "#111",
  border: "#333",
  icon: "#FFF",
};

const TodoListScreen = () => {
  const navigation = useNavigation();
  const [theme, setTheme] = useState("light");

  const [todos, setTodos] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [message, setMessage] = useState("");

  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const isDark = theme === "dark";
  const colors = isDark ? darkTheme : lightTheme;

  function getFormattedDate() {
    const today = new Date();
    const options = { weekday: "short", day: "2-digit", month: "long" };
    return today.toLocaleDateString("en-US", options);
  }

  const dateString = getFormattedDate();

  const toggleFilter = () => setShowFilter((prev) => !prev);

  const selectFilter = (type) => {
    setFilterType(type);
    setShowFilter(false);
  };

  // when the component or screen mounts to the DOM, i just want to fetch the todos from Async storage
  // that is what i did here and i set my empty todos array, to the fetched todos

  //   useEffect(() => {
  //     const loadTodos = async () => {
  //       const stored = await AsyncStorage.getItem("@todos");
  //       if (stored) setTodos(JSON.parse(stored));
  //     };
  //     loadTodos();
  //   }, []);

  // so i had to move from UseEffect which only runs once to useFocusEffect because it was not loading the todos when i use the device back button

  useFocusEffect(
    useCallback(() => {
      const loadTodos = async () => {
        const stored = await AsyncStorage.getItem("@todos");
        if (stored) {
          setTodos(JSON.parse(stored));
        }
      };

      loadTodos();
    }, [])
  );

  // this is my delete  todo function
  //   const deleteTodo = async (id) => {
  //     const updated = todos.filter((item) => item.id !== id);
  //     setTodos(updated);
  //     await AsyncStorage.setItem("@todos", JSON.stringify(updated));
  //   };

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "🚫 Error",
        text2: error,
        position: "top",
        visibilityTime: 3000,
        topOffset: 40,
      });
      setError("");
    }
  }, [error]);

  useEffect(() => {
    if (message) {
      Toast.show({
        type: "success",
        text1: "✅ Successful",
        text2: message,
        position: "top",
        visibilityTime: 3000,
        topOffset: 40,
      });

      setMessage("");
    }
  }, [message]);

  // this is my delete  todo function

  const deleteTodo = async (id) => {
    Alert.alert(
      "Delete Todo",
      "Are you sure you want to delete this Todo?",
      [
        { text: "Cancel", style: "cancel" },

        {
          text: "Yes,Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updated = todos.filter((item) => item.id !== id);
              setTodos(updated);
              await AsyncStorage.setItem("@todos", JSON.stringify(updated));

              setMessage("Todo deleted successfully!");
            } catch (error) {
              setError("Failed to delete todo");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // this function helps me to expand card
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // this function helps me to toggle completed todos
  const toggleCompleted = async (id) => {
    const updated = todos.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );

    setTodos(updated);
    await AsyncStorage.setItem("@todos", JSON.stringify(updated));
  };

  // this is my filter and search method
  const filteredTodos = todos
    .filter((todo) => {
      if (filterType === "Completed") return todo.completed === true;
      if (filterType === "Uncompleted") return todo.completed === false;
      return true;
    })
    .filter((todo) =>
      todo.title.toLowerCase().includes(searchText.toLowerCase())
    );






    

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, position: "relative" },
      ]}
    >
      {/* Header start */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerText, { color: colors.text }]}>
            My Day
          </Text>
          <Text style={[styles.headerText, { color: colors.text }]}>
            {dateString}
          </Text>
        </View>

        {/* Header end */}

        <TouchableOpacity onPress={toggleTheme}>
          {isDark ? (
            <Feather name="sun" size={24} color={colors.icon} />
          ) : (
            <Feather name="moon" size={24} color={colors.icon} />
          )}
        </TouchableOpacity>
      </View>

      {/* Search anf Filter start */}
      <View
        style={[styles.searchContainer, { backgroundColor: colors.searchBG }]}
      >
        <TouchableOpacity style={styles.filterSection} onPress={toggleFilter}>
          <Text style={[styles.filterLabel, { color: colors.text }]}>
            {filterType}
          </Text>
          <Entypo
            name={showFilter ? "chevron-thin-up" : "chevron-thin-down"}
            size={15}
            color={colors.icon}
          />
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.searchSection}>
          <Feather name="search" size={15} color={colors.icon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholderTextColor={isDark ? "#fff" : "#777"}
            placeholder="Search todo by title…"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {showFilter && (
        <View
          style={[
            styles.filterDropdown,
            { top: height * 0.19, left: width * 0.04 },
          ]}
        >
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => selectFilter("All")}
          >
            <Text style={styles.filterText}>All ({todos.length})</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => selectFilter("Completed")}
          >
            <Text style={styles.filterText}>
              Completed ({todos.filter((t) => t.completed).length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => selectFilter("Uncompleted")}
          >
            <Text style={styles.filterText}>
              Uncompleted ({todos.filter((t) => t.completed === false).length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {showFilter && (
        <Pressable
          style={[StyleSheet.absoluteFill, { zIndex: 5 }]}
          onPress={() => setShowFilter(false)}
        />
      )}

      {/* Search anf Filter end */}

      {/* Rendering all todos in a FlatList start */}
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={() => {
          if (todos.length > 0 && searchText) {
            return (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: colors.text }]}>
                  No result found
                </Text>
              </View>
            );
          }

          return (
            <View style={styles.emptyState}>
              <Entypo
                name="emoji-sad"
                size={40}
                color={isDark ? colors.text : "#888"}
              />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No todos available
              </Text>
              <Text style={[styles.emptySubText, { color: colors.text }]}>
                Add a task to get started
              </Text>
            </View>
          );
        }}
        renderItem={({ item: todo }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            {/* HEADER */}
            <View style={styles.cardHeader}>
              <TouchableOpacity onPress={() => toggleCompleted(todo.id)}>
                <Entypo
                  name={todo.completed ? "check" : "circle"}
                  size={16}
                  color={
                    todo.completed
                      ? isDark
                        ? "#7CFC00"
                        : "green"
                      : colors.icon
                  }
                  style={styles.circle}
                />
              </TouchableOpacity>

              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.text },
                  todo.completed && {
                    textDecorationLine: "line-through",
                    opacity: 0.4,
                  },
                ]}
              >
                {todo.title}
              </Text>

              <TouchableOpacity onPress={() => toggleExpand(todo.id)}>
                <Entypo
                  name={expandedId === todo.id ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.icon}
                />
              </TouchableOpacity>
            </View>

            {expandedId === todo.id && (
              <Text style={[styles.cardDescription, { color: colors.text }]}>
                {todo.description}
              </Text>
            )}

            <View style={styles.footerRow}>
              <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                <MaterialIcons name="delete" size={22} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Rendering all todos in a FlatList end */}

      {/* Toast for success  and error notifications */}
      <Toast />

      {/* Floating add button start */}

      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: theme === "light" ? "black" : "white" },
        ]}
        onPress={() => navigation.navigate("AddTodos")}
      >
        <AntDesign
          name="plus"
          size={28}
          color={theme === "light" ? "#fff" : "#000"}
        />
      </TouchableOpacity>

      {/* Floating add button end */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: height * 0.02,
  },

  header: {
    height: height * 0.13,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.03,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerText: {
    fontSize: moderateScale(20),
    fontWeight: "600",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    marginHorizontal: width * 0.04,
    borderRadius: moderateScale(12),
    paddingHorizontal: 10,
    height: moderateScale(45),
    marginBottom: 10,
    elevation: 2,
  },

  filterSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 5,
  },

  filterLabel: {
    fontSize: moderateScale(14),
    color: "#555",
    fontWeight: "500",
  },

  divider: {
    width: 1,
    height: "70%",
    backgroundColor: "#ccc",
    marginHorizontal: 10,
  },

  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: moderateScale(14),
    color: "#000",
    padding: 0,
  },

  filterDropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4,
    paddingVertical: 5,
    width: moderateScale(150),
    zIndex: 20,
  },

  filterItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  filterText: {
    fontSize: moderateScale(16),
    color: "black",
  },

  scrollContainer: {
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.15,
    marginTop: height * 0.02,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  circle: {
    marginRight: 12,
  },

  cardTitle: {
    color: "black",
    fontSize: moderateScale(12),
    fontWeight: 700,
    flex: 1,
  },

  cardDescription: {
    color: "black",
    fontSize: moderateScale(11),
    marginTop: 8,
  },

  footerRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  fab: {
    position: "absolute",
    bottom: height * 0.04,
    right: width * 0.05,
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  emptyState: {
    alignItems: "center",
    marginTop: 50,
    opacity: 0.7,
  },

  emptyText: {
    marginTop: 10,
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#555",
  },

  emptySubText: {
    fontSize: moderateScale(14),
    color: "#777",
    marginTop: 5,
  },
});

export default TodoListScreen;
