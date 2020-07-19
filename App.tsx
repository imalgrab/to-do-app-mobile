import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Header, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    TouchableOpacity,
    Keyboard,
} from 'react-native';

enum TodoTypes {
    ALL = 0,
    DONE = 1,
    PENDING = 2,
    SEARCH = 3,
}

type Todo = {
    id: number;
    text: string;
    completed: boolean;
};

interface TodoProps {
    todo: Todo;
    checkTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
    editTodoText: (id: number, text: string) => void;
}

interface InfoProps {
    filter: TodoTypes;
    countAll: number;
    countDone: number;
}

interface FormProps {
    addTodo: (text: string) => void;
}

interface ListProps {
    searchText: string;
    filter: TodoTypes;
    todos: Todo[];
    checkTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
    editTodoText: (id: number, text: string) => void;
}

interface FilterProps {
    showFiltered: (id: number) => void;
}

const Todo: React.FC<TodoProps> = ({ todo, checkTodo, deleteTodo, editTodoText }) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [textVal, setTextVal] = useState<string>(todo.text);

    const handleTodoEdit = (text: string) => {
        editTodoText(todo.id, text);
        setEditMode(!editMode);
        setTextVal(text);
    };

    const checkBoxName = todo.completed ? 'check-box-outline' : 'checkbox-blank-outline';
    const todoTextStyle = todo.completed ? styles.todoCheckedText : styles.todoText;
    const todoText = editMode ? (
        <TextInput
            ref={ti => ti && ti.focus()}
            value={textVal}
            onBlur={() => handleTodoEdit(textVal)}
            onChangeText={text => setTextVal(text)}
        />
    ) : (
        <Text
            style={todoTextStyle}
            onPress={() => checkTodo(todo.id)}
            onLongPress={() => setEditMode(!editMode)}>
            {todo.text}
        </Text>
    );
    return (
        <View style={styles.todoContainer}>
            <TouchableOpacity onPress={() => checkTodo(todo.id)}>
                <Icon style={styles.iconBtn} name={checkBoxName} />
            </TouchableOpacity>
            {todoText}
            <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                <Icon style={styles.iconBtn} name="trash-can-outline" />
            </TouchableOpacity>
        </View>
    );
};

const TodoInfo: React.FC<InfoProps> = ({ filter, countAll, countDone }) => {
    let text;
    switch (filter) {
        case TodoTypes.ALL:
            text = `${countDone} / ${countAll}`;
            break;
        case TodoTypes.DONE:
            text = `DONE: ${countDone}`;
            break;
        case TodoTypes.PENDING:
            text = `PENDING: ${countAll - countDone}`;
            break;
    }
    return (
        <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{text}</Text>
        </View>
    );
};

const TodoForm: React.FC<FormProps> = ({ addTodo }) => {
    const [textVal, setTextVal] = useState<string>('');
    const handleSubmit = () => {
        addTodo(textVal);
        setTextVal('');
        Keyboard.dismiss();
    };
    return (
        <View style={styles.formContainer}>
            <TextInput
                style={styles.formInput}
                value={textVal}
                placeholder="what needs to be done?"
                placeholderTextColor={'lightgray'}
                onChangeText={text => setTextVal(text)}
            />
            <TouchableOpacity onPress={handleSubmit}>
                <Icon style={styles.iconBtn} name="plus-circle-outline" />
            </TouchableOpacity>
        </View>
    );
};

const TodoList: React.FC<ListProps> = ({
    searchText,
    filter,
    todos,
    checkTodo,
    deleteTodo,
    editTodoText,
}) => {
    let todoList;

    switch (filter) {
        case TodoTypes.ALL:
            todoList = todos.map(todo => (
                <Todo
                    key={todo.id}
                    todo={todo}
                    checkTodo={checkTodo}
                    deleteTodo={deleteTodo}
                    editTodoText={editTodoText}
                />
            ));
            break;
        case TodoTypes.SEARCH:
            todoList = todos
                .filter(todo => todo.text.includes(searchText))
                .map(todo => (
                    <Todo
                        key={todo.id}
                        todo={todo}
                        checkTodo={checkTodo}
                        deleteTodo={deleteTodo}
                        editTodoText={editTodoText}
                    />
                ));
            break;
        default:
            const status = filter === TodoTypes.DONE;
            todoList = todos
                .filter(todo => todo.completed === status)
                .map(todo => (
                    <Todo
                        key={todo.id}
                        todo={todo}
                        checkTodo={checkTodo}
                        deleteTodo={deleteTodo}
                        editTodoText={editTodoText}
                    />
                ));
            break;
    }
    return (
        <View style={styles.listContainer}>
            <ScrollView>{todoList}</ScrollView>
        </View>
    );
};

const TodoFilter: React.FC<FilterProps> = ({ showFiltered }) => {
    const [activeBtn, setActiveBtn] = useState<number>(0);
    const iconNames = ['calendar-clock', 'clock-check-outline', 'clock-outline'];
    const iconActiveNames = ['calendar-clock', 'clock-check', 'clock'];
    const buttons = ['all', 'done', 'pending'].map((type, i) => (
        <TouchableOpacity style={styles.filterBtn} onPress={() => updateActiveBtn(i)}>
            <Icon
                style={styles.filterIcon}
                name={activeBtn === i ? iconActiveNames[i] : iconNames[i]}
            />
            <Text style={activeBtn === i ? styles.filterTextActive : styles.filterText}>
                {type}
            </Text>
        </TouchableOpacity>
    ));
    const updateActiveBtn = (index: number) => {
        setActiveBtn(index);
        showFiltered(index);
    };
    return <View style={styles.filterContainer}>{buttons}</View>;
};

export default function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [id, setId] = useState<number>(0);
    const [filter, setFilter] = useState<TodoTypes>(TodoTypes.ALL);
    const [showSearchbar, setShowSearchbar] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

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
    const handleFilter = (id: number) => {
        switch (id) {
            case TodoTypes.ALL:
                setFilter(TodoTypes.ALL);
                break;
            case TodoTypes.DONE:
                setFilter(TodoTypes.DONE);
                break;
            case TodoTypes.PENDING:
                setFilter(TodoTypes.PENDING);
                break;
        }
    };
    const handleEdit = (id: number, text: string) => {
        const newTodos = [...todos];
        newTodos.forEach(todo => {
            if (todo.id === id) {
                todo.text = text;
            }
        });
        setTodos(newTodos);
    };

    const updateSearch = (text: string) => {
        setSearchText(text);
        setFilter(TodoTypes.SEARCH);
    };

    const searchBar = showSearchbar ? (
        <SearchBar
            containerStyle={{
                flex: 1,
                backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
            }}
            inputContainerStyle={{
                height: 35,
                backgroundColor: '#2f4e96',
            }}
            searchIcon={false}
            lightTheme={true}
            placeholderTextColor="lightgray"
            placeholder="search..."
            onChangeText={updateSearch}
            value={searchText}
        />
    ) : null;
    return (
        <NavigationContainer>
            <View style={styles.appContainer}>
                <Header
                    containerStyle={styles.header}
                    leftComponent={
                        <Icon
                            onPress={() => setShowSearchbar(!showSearchbar)}
                            name="magnify"
                            color="#fff"
                            size={30}
                        />
                    }
                    centerComponent={
                        <TodoInfo
                            filter={filter}
                            countAll={todos.length}
                            countDone={todos.filter(todo => todo.completed).length}
                        />
                    }
                />
                {searchBar}
                <TodoForm addTodo={handleInsert} />
                <TodoList
                    searchText={searchText}
                    filter={filter}
                    todos={todos}
                    checkTodo={handleToggle}
                    deleteTodo={handleDelete}
                    editTodoText={handleEdit}
                />
                <TodoFilter showFiltered={handleFilter} />
            </View>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    appContainer: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#40527d',
    },
    header: {
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
    todoCheckedText: {
        color: '#eee',
        fontSize: 18,
        textDecorationLine: 'line-through',
    },
    todoText: {
        color: '#000',
        fontSize: 18,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        color: '#fff',
        fontSize: 14,
    },
    formContainer: {
        backgroundColor: '#fff',
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    formInput: {
        width: 200,
        height: 30,
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#40527d',
    },
    listContainer: {
        flex: 9,
        backgroundColor: '#fff',
    },
    filterContainer: {
        paddingLeft: 5,
        paddingRight: 5,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1.25,
    },
    filterBtn: {
        alignItems: 'center',
        flex: 1,
    },
    filterText: {
        color: '#fff',
        fontWeight: '200',
        fontSize: 12,
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
    },
    filterIcon: {
        color: '#fff',
        fontSize: 24,
    },
    iconBtn: {
        color: '#2f4e96',
        fontSize: 30,
    },
});
