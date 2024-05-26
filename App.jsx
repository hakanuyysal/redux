import React from 'react';
import {StyleSheet, SafeAreaView, Text} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import Todos from './src/components/Todos';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>hakan's todos</Text>
        <Todos />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default App;
