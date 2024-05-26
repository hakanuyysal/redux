import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Alert,
} from 'react-native';

const TodoItem = ({item, onDelete}) => {
  const [showDelete, setShowDelete] = useState(false);
  const pan = useState(new Animated.ValueXY())[0];

  const handleDelete = () => {
    onDelete(item.id);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Silmek istediğinize emin misiniz?',
      'Seçtiğiniz todo silinecektir.',
      [
        {
          text: 'Vazgeç',
          onPress: () =>
            Animated.spring(pan, {
              toValue: {x: 0, y: 0},
              useNativeDriver: false,
            }).start(),
        },
        {text: 'Sil', onPress: handleDelete, style: 'destructive'},
      ],
      {cancelable: true},
    );
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
        Animated.event([null, {dx: pan.x}], {useNativeDriver: false})(
          evt,
          gestureState,
        );
        if (gestureState.dx < -50) {
          setShowDelete(true);
        } else {
          setShowDelete(false);
        }
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -50) {
        confirmDelete();
      } else {
        Animated.spring(pan, {
          toValue: {x: 0, y: 0},
          useNativeDriver: false,
        }).start();
        setShowDelete(false);
      }
    },
  });

  return (
    <Animated.View
      style={[styles.todoContainer, {transform: [{translateX: pan.x}]}]}
      {...panResponder.panHandlers}>
      <Text>{item.title}</Text>
      {showDelete && (
        <View style={styles.deletePrompt}>
          <Text style={styles.promptText}>
            Kaydırarak silmek için onaylayın
          </Text>
        </View>
      )}
      {/* Additional content if needed */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  deletePrompt: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 99, 71, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  promptText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TodoItem;
