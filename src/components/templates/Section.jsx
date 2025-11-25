// src/components/templates/Section.jsx
import React from 'react';
import Text from '../atoms/Text';
import DynamicTable from '../molecules/DynamicTable';

const Section = ({ content, className }) => {
    const renderSection = (section) => {
        switch (section.type) {
            case 'text':
                return section.text.map(textItem => (
                    <Text 
                        key={textItem.id}
                        variant={textItem.variant} 
                        className={textItem.className}
                    >
                        {textItem.content}
                    </Text>
                ));
            case 'table':
                return (
                    <DynamicTable
                        title={section.title}
                        columns={section.columns}
                        data={section.data}
                        className={section.className}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className={className}>
            {content.map((section, index) => (
                <div key={index}>
                    {renderSection(section)}
                </div>
            ))}
        </div>
    );
};

export default Section;