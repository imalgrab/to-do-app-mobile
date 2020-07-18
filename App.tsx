import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Switch,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons';
import { Icon } from 'react-native-elements';

type Todo = {
    id: number;
    text: string;
    completed: boolean;
};

interface TodoProps {
    todo: Todo;
    checkTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
}

interface InfoProps {
    countAll: number;
    countDone: number;
}

interface FormProps {
    addTodo: (text: string) => void;
}

interface ListProps {
    todos: Todo[];
    checkTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
}

const Todo: React.FC<TodoProps> = ({ todo, checkTodo, deleteTodo }) => {
    const checkBox = todo.completed ? (
        <Icon
            style={{ borderWidth: 1, borderColor: 'black' }}
            name="checkbox"
            size={30}
            color="white"
        />
    ) : (
        <Icon
            style={{ borderWidth: 1, borderColor: 'black' }}
            name="square"
            size={30}
            color="black"
        />
    );
    return (
        <View style={styles.todoContainer}>
            <TouchableOpacity onPress={() => checkTodo(todo.id)}>
                {checkBox}
            </TouchableOpacity>
            <Text style={{ color: '#000' }}>{todo.text}</Text>
            <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                <Icon name="trash" size={30} color="tomato" />
            </TouchableOpacity>
        </View>
    );
};

const TodoInfo: React.FC<InfoProps> = ({ countAll, countDone }) => (
    <View style={styles.infoContainer}>
        <Text style={styles.infoText}>total: {countAll}</Text>
        <Text style={styles.infoText}>completed: {countDone}</Text>
    </View>
);

const TodoForm: React.FC<FormProps> = ({ addTodo }) => {
    const [textVal, setTextVal] = useState<string>('');
    const handleSubmit = () => {
        addTodo(textVal);
        setTextVal('');
    };
    return (
        <View style={styles.formContainer}>
            <TextInput
                style={styles.formInput}
                onChangeText={text => setTextVal(text)}
                value={textVal}
                placeholder="what needs to be done?"
                placeholderTextColor={'lightgray'}
            />
            <TouchableOpacity onPress={handleSubmit}>
                <Text style={styles.formButtonText}>add</Text>
            </TouchableOpacity>
        </View>
    );
};

const TodoList: React.FC<ListProps> = ({ todos, checkTodo, deleteTodo }) => {
    const todoList = todos.map(todo => (
        <Todo key={todo.id} todo={todo} checkTodo={checkTodo} deleteTodo={deleteTodo} />
    ));
    return (
        <View style={styles.listContainer}>
            <ScrollView>{todoList}</ScrollView>
        </View>
    );
};

export default function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [id, setId] = useState<number>(0);

    const handleInsert = (text: string) => {
        setTodos([...todos, { id, text, completed: false }]);
        setId(id + 1);
    };
    const handleToggle = (id: number) => {
        const newTodos = [...todos];
        newTodos.map(todo => {
            if (todo.id === id) {
                todo.completed = !todo.completed;
            }
        });
        setTodos(newTodos);
    };
    const handleDelete = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };
    return (
        <NavigationContainer>
            <View style={styles.appContainer}>
                <TodoInfo
                    countAll={todos.length}
                    countDone={todos.filter(todo => todo.completed).length}
                />
                <TodoForm addTodo={handleInsert} />
                <TodoList
                    todos={todos}
                    checkTodo={handleToggle}
                    deleteTodo={handleDelete}
                />
                <StatusBar style="auto" />
            </View>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    appContainer: {
        justifyContent: 'center',
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#40527d',
    },
    todoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
    todoButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    infoContainer: {
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoText: {
        color: '#fff',
    },
    formContainer: {
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    formInput: {
        width: 200,
        height: 30,
        fontSize: 18,
        borderBottomWidth: 0.5,
    },
    formButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContainer: {
        flex: 5,
        backgroundColor: '#fff',
    },
});
