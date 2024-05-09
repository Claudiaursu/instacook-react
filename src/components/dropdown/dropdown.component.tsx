import React, { useState } from 'react';
  import { StyleSheet } from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
import { CollectionDto } from '../../services/collection.service';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';

  const DropdownComponent = ({data}: {data: CollectionDto[]}) => {
    const [value, setValue] = useState<string>("");

    return (
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        itemContainerStyle={styles.itemContainerStyle}
        iconStyle={styles.iconStyle}
        data={data as CollectionDto[]}
        search
        maxHeight={300}
        labelField="titluColectie"
        valueField="id"
        placeholder="Choose collection"
        searchPlaceholder="Search..."
        value={value}
        onChange={item => {
          setValue(item.id);
        }}
      />
    );
  };

  export default DropdownComponent;

  const styles = StyleSheet.create({
    dropdown: {
      margin: 15,
      //height: 50,
      width: '90%',
      borderBottomColor: 'pink',
      borderBottomWidth: 1.3,
      backgroundColor: '#ffe6e6'
    },
    icon: {
      marginRight: 5,
    },
    placeholderStyle: {
      fontSize: 12
    },
    selectedTextStyle: {
      fontSize: 14
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 12,
      backgroundColor: '#d6f5f5',
      margin:0,
      marginBottom:0
    },
    itemContainerStyle: {
      backgroundColor: '#eafafa',
      fontSize: 12
    },
    containerStyle: {
      backgroundColor: '#5c5d72'
    }
  });