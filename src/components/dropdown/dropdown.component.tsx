import React, { useState } from 'react';
  import { StyleSheet } from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
import { CollectionDto } from '../../services/collection.service';
import { useThemeConsumer } from '../../utils/theme/theme.consumer';

function isColectieArray(arr: any[]): arr is CollectionDto[] {
  return arr.length > 0 && typeof arr[0] === "object" && "titluColectie" in arr[0]; 
}

  type Dificulty = {
    id: number,
    value: string
  }

  const DropdownComponent = ({
    data,
    action
  }: {
    data: CollectionDto[] | Dificulty[];
    action: (text: any) => void
  }) => {
    const [value, setValue] = useState<string>("");

    const {
      theme
  } = useThemeConsumer();  

    if (!isColectieArray(data)) {
      return (
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={{
            color: theme.colors.cardTitle,
            fontSize: 14,
            fontWeight: "bold"
          }}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          itemContainerStyle={styles.itemContainerStyle}
          iconStyle={styles.iconStyle}
          data={data as Dificulty[]}
          search
          maxHeight={300}
          labelField="value"
          valueField="value"
          placeholder="Choose dificulty level"
          searchPlaceholder="Search..."
          value={value}
          onChange={(item) => {
            setValue(item.value);
            action(item.value)
          }}
        />
      );
    } else {
      return (
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={{
            color: theme.colors.cardTitle,
            fontSize: 14,
            fontWeight: "bold"
          }}
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
          onChange={(item) => {
            setValue(item.id);
            action(item.id)
            action(item.id)
          }}
        />
      );
    }
  };

  export default DropdownComponent;

  const styles = StyleSheet.create({
    dropdown: {
      marginBottom: 25,
      marginTop: 0,
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
      fontSize: 12,
      //color: theme.colors.cardTitle
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