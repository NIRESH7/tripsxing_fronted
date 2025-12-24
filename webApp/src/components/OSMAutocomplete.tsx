import React, { useState, useEffect } from 'react';
import { AutoComplete, Input } from 'antd';
import axios from 'axios';
import { debounce } from 'lodash';

// Pointing to our local Python server
const API_ENDPOINT = 'http://localhost:8000/api/search';

interface OSMAutocompleteProps {
    value?: string;
    onChange?: (value: string) => void;
    onSelect?: (value: string, option: any) => void;
    placeholder?: string;
    style?: React.CSSProperties;
}

interface OSMSuggestion {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

const OSMAutocomplete: React.FC<OSMAutocompleteProps> = ({ value, onChange, onSelect, placeholder, style }) => {
    const [options, setOptions] = useState<{ value: string; label: string; lat: string; lon: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSuggestions = debounce(async (searchText: string) => {
        if (!searchText) {
            setOptions([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(API_ENDPOINT, {
                params: {
                    q: searchText,
                },
            });

            if (response.data) {
                const suggestions = response.data.map((item: OSMSuggestion) => ({
                    value: item.display_name,
                    label: item.display_name,
                    lat: item.lat,
                    lon: item.lon,
                }));
                setOptions(suggestions);
            }
        } catch (error) {
            console.error('Error fetching address suggestions:', error);
        } finally {
            setLoading(false);
        }
    }, 300); // Faster debounce

    const handleSearch = (value: string) => {
        fetchSuggestions(value);
    };

    const handleChange = (data: string) => {
        if (onChange) {
            onChange(data);
        }
    };

    const handleSelect = (value: string, option: any) => {
        if (onSelect) {
            onSelect(value, option);
        }
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <AutoComplete
            value={value}
            options={options}
            onSearch={handleSearch}
            onChange={handleChange}
            onSelect={handleSelect}
            style={style}
        >
            <Input placeholder={placeholder || "Enter address"} />
        </AutoComplete>
    );
};

export default OSMAutocomplete;
