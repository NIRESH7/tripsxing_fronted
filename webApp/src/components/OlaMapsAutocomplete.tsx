import React, { useState, useEffect } from 'react';
import { AutoComplete, Input, message } from 'antd';
import axios from 'axios';
import { debounce } from 'lodash';

// Provided by user
const API_KEY = 'ed7bcf6ffc66a54231001106a228c3fa';
const API_ENDPOINT = 'https://api.olamaps.io/places/v1/autocomplete';

interface OlaMapsAutocompleteProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    style?: React.CSSProperties;
}

interface Suggestion {
    description: string;
    place_id: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    }
}

const OlaMapsAutocomplete: React.FC<OlaMapsAutocompleteProps> = ({ value, onChange, placeholder, style }) => {
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
    const [loading, setLoading] = useState(false);

    // Debounce the API call to avoid too many requests
    const fetchSuggestions = debounce(async (searchText: string) => {
        if (!searchText) {
            setOptions([]);
            return;
        }

        setLoading(true);
        try {
            // Use the provided request-id if needed, but for now just api_key
            const response = await axios.get(API_ENDPOINT, {
                params: {
                    input: searchText,
                    api_key: API_KEY,
                },
                headers: {
                    'X-Request-Id': 'ed7bcf6ffc66a54231001106a228c3fa' // using the SDK key as request ID based on user input, or random UUID
                }
            });

            if (response.data && response.data.predictions) {
                const suggestions = response.data.predictions.map((item: Suggestion) => ({
                    value: item.description,
                    label: item.description,
                }));
                setOptions(suggestions);
            }
        } catch (error) {
            console.error('Error fetching address suggestions:', error);
            // Fail silently or show error
            // message.error('Failed to load address suggestions'); 
        } finally {
            setLoading(false);
        }
    }, 500);

    const handleSearch = (value: string) => {
        fetchSuggestions(value);
    };

    const handleChange = (data: string) => {
        if (onChange) {
            onChange(data);
        }
    };

    return (
        <AutoComplete
            value={value}
            options={options}
            onSearch={handleSearch}
            onChange={handleChange}
            style={style}
        >
            <Input placeholder={placeholder || "Enter address"} />
        </AutoComplete>
    );
};

export default OlaMapsAutocomplete;
