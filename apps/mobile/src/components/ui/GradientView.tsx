import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

interface Props extends ViewProps {
    children: React.ReactNode;
}

const GradientView = ({children, style, ...props}: Props) => {
    return (
        <LinearGradient
            colors={['#EFF3FA', '#E6EBF5']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={[styles.container, style]}
            {...props}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default GradientView;