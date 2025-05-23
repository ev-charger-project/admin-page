import { FunctionComponent, PropsWithChildren } from "react";
import { Flex } from "antd";
import React from "react";

interface DropdownHeaderConfigItem {
    label: string;
    span: number;
}

interface DropdownHeaderProps extends PropsWithChildren {
    config: DropdownHeaderConfigItem[];
    baseSpan?: number;
}

const DropdownHeader: FunctionComponent<DropdownHeaderProps> = ({ config, children, baseSpan = 12 }) => {
    return (
        <div>
            <Flex
                style={{
                    padding: "5px 12px"
                }}>
                {config.map((item) => {
                    return (
                        <Flex
                            key={item.label}
                            vertical
                            style={{
                                width: `${(item.span / baseSpan) * 100}%`
                            }}>
                            <div
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "12px"
                                }}>
                                {item.label}
                            </div>
                        </Flex>
                    );
                })}
            </Flex>

            {children}
        </div>
    );
};

export default DropdownHeader;
