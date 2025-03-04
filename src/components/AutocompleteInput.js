import React, { useState, useEffect } from 'react';
import { TextInput, FlatList, View, Text } from 'react-native';

const AutocompleteInput = ({ data, onChangeText, value }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        console.log('data', data)
        //const filtered = data.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()));
        setFilteredData(filtered);
    }, [inputValue, data]);

    const handleTextChange = text => {
        setInputValue(text);
        onChangeText(text);
    };

    return (
        <View>
            <TextInput
                value={inputValue}
                onChangeText={handleTextChange}
                placeholder="Type something"
            />
            <FlatList
                data={filteredData}
                renderItem={({ item }) => (
                    <Text onPress={() => setInputValue(item)}>{item}</Text>
                )}
                keyExtractor={item => item}
            />
        </View>
    );
}
export default AutocompleteInput