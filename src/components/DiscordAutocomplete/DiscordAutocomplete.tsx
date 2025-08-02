// TODO: custom renderOption for username, nickname and profile pic.

import { SelectProps, Combobox, Loader, TextInput } from '@mantine/core';
import { useCombobox } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';

export interface UserProps extends SelectProps {
    userId: number;
    email: string;
    username: string;
    nickname: string;
  }

const users: UserProps[] = [
    {email: "test1@example.com", username: 'aaron123', nickname: '[PFC] aaron', userId: 1},
    {email: "test2@example.com", username: 'menace_archi', nickname: '[GEN] archi', userId: 2},
    {email: "test3@example.com", username: 'steampunk', nickname: '[PTE] covert SP', userId: 3},
]

// const data = users.map((item) => ({ ...item, value: item.nickname }));

// const largeData = Array(100_000)
//   .fill(0)
//   .map((_, index) => `Option ${index}`);


// export default function DiscordAutocomplete() {
//     const [searchValue, setSearchValue] = useDebouncedState('', 1000);
//     const [value, setValue] = useInputState('')

//     useEffect(() => {

//         console.log('Search Value Changed:', searchValue);
//     }, [searchValue])

//     useEffect(() => {
        
//         console.log(`SelectedOption: ${value}`)
//     }, [value])

//     return (
//         <Autocomplete
//         label="100 000 options autocomplete"
//         placeholder="Use limit to optimize performance"
//         limit={6}
//         data={data}
//         itemComponent={AutoCompleteItem}
//         onChange={(val) => {
//             setSearchValue(val);
//         }}
//         onOptionSubmit={(val) => {
//             setValue(val)
//         }}
//         />
//     );
// }

function getAsyncData(searchQuery: string, signal: AbortSignal) {
  return new Promise<UserProps[]>((resolve, reject) => {
    signal.addEventListener('abort', () => {
      reject(new Error('Request aborted'));
    });

    setTimeout(() => {
      resolve(
        users.filter((item) => item.nickname.toLowerCase().includes(searchQuery.toLowerCase())).slice(
          0,
          5
        )
      );
    }, Math.random() * 1000);
  });
}

interface ChildProps {
    getDiscordUser: (data: UserProps) => void;
}

const AsyncAutocomplete: React.FC<ChildProps> = ({ getDiscordUser }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserProps[] | null>(null);
  const [value, setValue] = useState('');
  const [valueText, setValueText] = useState('');
  const [empty, setEmpty] = useState(false);
  const abortController = useRef<AbortController | undefined>(undefined);

  const fetchOptions = (query: string) => {
    abortController.current?.abort();
    abortController.current = new AbortController();
    setLoading(true);

    getAsyncData(query, abortController.current.signal)
      .then((result) => {
        setData(result);
        setLoading(false);
        setEmpty(result.length === 0);
        abortController.current = undefined;
      })
      .catch(() => {});
  };

  useEffect(() => {
    const userData = data?.find((user) => user.userId === Number(value))

    if (userData === undefined) {
        return;
    }

    getDiscordUser(userData)
  }, [value])

  const options = (data || []).map((item) => (
    <Combobox.Option value={String(item.userId)} key={item.userId}>
      {item.nickname}
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        const userData = data?.find((user) => user.userId === Number(optionValue ));

        setValueText(userData?.nickname ?? '')
        setValue(optionValue);
        combobox.closeDropdown();
      }}
      withinPortal={false}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          label="Pick value or type anything"
          placeholder="Search groceries"
          value={valueText}
          onChange={(event) => {
            const userData = data?.find((user) => user.userId === Number(event.currentTarget.value ));

            setValueText(userData?.nickname ?? '')
            setValue(event.currentTarget.value);
            fetchOptions(event.currentTarget.value);
            combobox.resetSelectedOption();
            combobox.openDropdown();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => {
            combobox.openDropdown();
            if (data === null) {
              fetchOptions(value);
            }
          }}
          onBlur={() => combobox.closeDropdown()}
          rightSection={loading && <Loader size={18} />}
        />
      </Combobox.Target>

      <Combobox.Dropdown hidden={data === null}>
        <Combobox.Options>
          {options}
          {empty && <Combobox.Empty>No results found</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default AsyncAutocomplete