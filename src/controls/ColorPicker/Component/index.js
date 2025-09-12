import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { stopPropagation } from "../../../utils/common";
import Option from "../../../components/Option";
import "./styles.css";

class LayoutComponent extends Component {
    static propTypes = {
        expanded: PropTypes.bool,
        onExpandEvent: PropTypes.func,
        onChange: PropTypes.func,
        config: PropTypes.object,
        currentState: PropTypes.object,
        translations: PropTypes.object,
    };

    state = {
        currentStyle: "color",
    };

    componentDidUpdate(prevProps) {
        const { expanded } = this.props;
        if (expanded && !prevProps.expanded) {
            this.setState({
                currentStyle: "color",
            });
        }
    }

    onChange = (color) => {
        const { onChange } = this.props;
        const { currentStyle } = this.state;
        onChange(currentStyle, color);
    };

    setCurrentStyleColor = () => {
        this.setState({
            currentStyle: "color",
        });
    };

    setCurrentStyleBgcolor = () => {
        this.setState({
            currentStyle: "bgcolor",
        });
    };

    renderModal = () => {
        const {
            config: { popupClassName, colors },
            currentState: { color, bgColor },
            translations,
        } = this.props;
        const { currentStyle } = this.state;
        const currentSelectedColor = currentStyle === "color" ? color : bgColor;
        return (
            <div
                className={classNames("rdw-colorpicker-modal", popupClassName)}
                onClick={stopPropagation}
                role="dialog"
                aria-modal="true"
                aria-label="Color picker dialog"
            >
                <div className="rdw-colorpicker-modal-header" role="tablist">
                    <span
                        className={classNames("rdw-colorpicker-modal-style-label", {
                            "rdw-colorpicker-modal-style-label-active": currentStyle === "color",
                        })}
                        onClick={this.setCurrentStyleColor}
                        role="tab"
                        aria-selected={currentStyle === "color"}
                        tabIndex={currentStyle === "color" ? 0 : -1}
                    >
                        {translations["components.controls.colorpicker.text"]}
                    </span>
                    <span
                        className={classNames("rdw-colorpicker-modal-style-label", {
                            "rdw-colorpicker-modal-style-label-active": currentStyle === "bgcolor",
                        })}
                        onClick={this.setCurrentStyleBgcolor}
                        role="tab"
                        aria-selected={currentStyle === "bgcolor"}
                        tabIndex={currentStyle === "bgcolor" ? 0 : -1}
                    >
                        {translations["components.controls.colorpicker.background"]}
                    </span>
                </div>
                <div
                    className="rdw-colorpicker-modal-options"
                    role="tabpanel"
                    aria-label={`${currentStyle} color options`}
                >
                    {colors.map((c, index) => (
                        <Option
                            value={c}
                            key={index}
                            className="rdw-colorpicker-option"
                            activeClassName="rdw-colorpicker-option-active"
                            active={currentSelectedColor === c}
                            onClick={this.onChange}
                            title={`Select ${c} color`}
                        >
                            <span
                                style={{ backgroundColor: c }}
                                className="rdw-colorpicker-cube"
                                aria-label={`Color ${c}`}
                            />
                        </Option>
                    ))}
                </div>
            </div>
        );
    };

    render() {
        const {
            config: { icon, className, title },
            expanded,
            onExpandEvent,
            translations,
        } = this.props;
        return (
            <div
                className="rdw-colorpicker-wrapper"
                aria-haspopup="dialog"
                aria-expanded={expanded}
                aria-label={
                    translations["components.controls.colorpicker.colorpicker"] || "Color picker"
                }
                role="combobox"
                title={title || translations["components.controls.colorpicker.colorpicker"]}
            >
                <Option
                    onClick={onExpandEvent}
                    className={classNames(className)}
                    title={title || translations["components.controls.colorpicker.colorpicker"]}
                >
                    <img src={icon} alt="" />
                </Option>
                {expanded ? this.renderModal() : undefined}
            </div>
        );
    }
}

export default LayoutComponent;
