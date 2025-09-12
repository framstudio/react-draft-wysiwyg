/* @flow */

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { stopPropagation } from "../../../utils/common";
import Option from "../../../components/Option";
import "./styles.css";

class LayoutComponent extends Component {
    static propTypes: Object = {
        expanded: PropTypes.bool,
        onExpandEvent: PropTypes.func,
        onChange: PropTypes.func,
        config: PropTypes.object,
        translations: PropTypes.object,
    };

    onChange: Function = (event: Object): void => {
        const { onChange } = this.props;
        onChange(event.target.innerHTML);
    };

    renderEmojiModal(): Object {
        const {
            config: { popupClassName, emojis },
        } = this.props;
        return (
            <div
                className={classNames("rdw-emoji-modal", popupClassName)}
                onClick={stopPropagation}
                role="dialog"
                aria-modal="true"
                aria-label="Emoji picker dialog"
            >
                <div role="grid" aria-label="Available emojis">
                    {emojis.map((emoji, index) => (
                        <span
                            key={index}
                            className="rdw-emoji-icon"
                            role="gridcell"
                            tabIndex={0}
                            onClick={this.onChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    this.onChange(e);
                                }
                            }}
                            aria-label={`Emoji ${emoji}`}
                            title={`Insert ${emoji} emoji`}
                        >
                            {emoji}
                        </span>
                    ))}
                </div>
            </div>
        );
    }

    render(): Object {
        const {
            config: { icon, className, title },
            expanded,
            onExpandEvent,
            translations,
        } = this.props;
        return (
            <div
                className="rdw-emoji-wrapper"
                aria-haspopup="dialog"
                aria-label={translations["components.controls.emoji.emoji"] || "Emoji picker"}
                aria-expanded={expanded}
                role="combobox"
                title={title || translations["components.controls.emoji.emoji"]}
            >
                <Option
                    className={classNames(className)}
                    value="unordered-list-item"
                    onClick={onExpandEvent}
                    title={title || translations["components.controls.emoji.emoji"]}
                >
                    <img src={icon} alt="" />
                </Option>
                {expanded ? this.renderEmojiModal() : undefined}
            </div>
        );
    }
}

export default LayoutComponent;
