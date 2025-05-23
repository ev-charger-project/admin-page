import { FunctionComponent } from "react";
import { Flex } from "antd";
import React from "react";

interface DropdownRowConfigItem {
    render: () => JSX.Element;
    span: number;
}

interface DropdownRowProps {
    config: DropdownRowConfigItem[];
    baseSpan?: number;
}

const DropdownRow: FunctionComponent<DropdownRowProps> = ({ config, baseSpan = 12 }) => {
    return (
        <Flex
            style={{
                padding: "5px 0px"
            }}>
            {config.map((item, index) => {
                return (
                    <Flex
                        key={index}
                        vertical
                        style={{
                            width: `${(item.span / baseSpan) * 100}%`
                        }}>
                        <div
                            style={{
                                textWrap: "wrap"
                            }}>
                            {item.render()}
                        </div>
                    </Flex>
                );
            })}
        </Flex>
    );
};

export default DropdownRow;
