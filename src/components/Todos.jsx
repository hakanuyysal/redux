import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useDispatch, useSelector} from 'react-redux';
import {fetchTodos, addTodo, deleteTodo} from '../store/todosSlice';
import TodoItem from '../components/TodoItem';

const Todos = () => {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos.todos);
  const todoStatus = useSelector(state => state.todos.status);
  const error = useSelector(state => state.todos.error);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    if (todoStatus === 'idle') {
      dispatch(fetchTodos());
    }
  }, [todoStatus, dispatch]);

  const handleDeleteTodo = id => {
    dispatch(deleteTodo(id));
  };

  const handleAddNewTodo = async () => {
    if (newTodoTitle.trim() === '') return;

    const newTodo = {
      userId: 1,
      id: new Date().getTime(),
      title: newTodoTitle,
      completed: false,
    };

    try {
      await dispatch(addTodo(newTodo));
      setNewTodoTitle('');
      setIsModalVisible(false);
    } catch (error) {
      console.error('err', error.message);
    }
  };

  const renderItem = ({item}) => (
    <TodoItem item={item} onDelete={handleDeleteTodo} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Todo"
              value={newTodoTitle}
              onChangeText={text => setNewTodoTitle(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddNewTodo}>
              <Text style={styles.buttonText}>Gönder</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.buttonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  flatListContainer: {
    paddingBottom: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    borderRadius: '30px',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    marginTop: 10,
  },
});

export default Todos;
