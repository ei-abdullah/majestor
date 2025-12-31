import React from "react"
import StyledTextInput from "@/src/components/ui/StyledTextInput";

type Props = {
    value?: string;
    onChange: (value: string) => void;
    className?: string;
    size?: 'default' | 'compact';
}

function SearchBar(
    {
        value = "",
        onChange,
        className = "",
        size = 'default'
    }: Props) {
    return (
        <StyledTextInput
            placeholder="Search"
            value={value}
            icon="search"
            onChangeText={(text) => onChange(text)}
            className={`flex items-center justify-center ${className}`}
            size={size}
        />
    )
}

export default SearchBar;