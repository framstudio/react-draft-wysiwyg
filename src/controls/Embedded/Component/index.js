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
        translations: PropTypes.object,
        doCollapse: PropTypes.func,
    };

    state = {
        embeddedLink: "",
        height: this.props.config.defaultSize.height,
        width: this.props.config.defaultSize.width,
    };

    componentDidUpdate(prevProps) {
        const { expanded, config } = this.props;
        if (!expanded && prevProps.expanded) {
            const { height, width } = config.defaultSize;
            this.setState({
                embeddedLink: "",
                height,
                width,
            });
        }
    }

    onChange = () => {
        const { onChange } = this.props;
        const { embeddedLink, height, width } = this.state;
        onChange(embeddedLink, height, width);
    };

    updateValue = (event) => {
        this.setState({
            [`${event.target.name}`]: event.target.value,
        });
    };

    rendeEmbeddedLinkModal() {
        const { embeddedLink, height, width } = this.state;
        const {
            config: { popupClassName },
            doCollapse,
            translations,
        } = this.props;
        return (
            <div
                className={classNames("rdw-embedded-modal", popupClassName)}
                onClick={stopPropagation}
                role="dialog"
                aria-modal="true"
                aria-label="Embedded content dialog"
            >
                <div className="rdw-embedded-modal-header">
                    <span className="rdw-embedded-modal-header-option">
                        {translations["components.controls.embedded.embeddedlink"]}
                        <span className="rdw-embedded-modal-header-label" />
                    </span>
                </div>
                <div className="rdw-embedded-modal-link-section">
                    <span className="rdw-embedded-modal-link-input-wrapper">
                        <label htmlFor="embedded-link-input" className="rdw-sr-only">
                            {translations["components.controls.embedded.enterlink"]}
                        </label>
                        <input
                            id="embedded-link-input"
                            className="rdw-embedded-modal-link-input"
                            placeholder={translations["components.controls.embedded.enterlink"]}
                            onChange={this.updateValue}
                            onBlur={this.updateValue}
                            value={embeddedLink}
                            name="embeddedLink"
                            aria-required="true"
                            aria-describedby="embedded-link-required"
                        />
                        <span
                            id="embedded-link-required"
                            className="rdw-image-mandatory-sign"
                            aria-label="Required field"
                        >
                            *
                        </span>
                    </span>
                    <div className="rdw-embedded-modal-size">
                        <span>
                            <label htmlFor="embedded-height-input" className="rdw-sr-only">
                                Height
                            </label>
                            <input
                                id="embedded-height-input"
                                onChange={this.updateValue}
                                onBlur={this.updateValue}
                                value={height}
                                name="height"
                                className="rdw-embedded-modal-size-input"
                                placeholder="Height"
                                aria-required="true"
                                aria-describedby="embedded-height-required"
                            />
                            <span
                                id="embedded-height-required"
                                className="rdw-image-mandatory-sign"
                                aria-label="Required field"
                            >
                                *
                            </span>
                        </span>
                        <span>
                            <label htmlFor="embedded-width-input" className="rdw-sr-only">
                                Width
                            </label>
                            <input
                                id="embedded-width-input"
                                onChange={this.updateValue}
                                onBlur={this.updateValue}
                                value={width}
                                name="width"
                                className="rdw-embedded-modal-size-input"
                                placeholder="Width"
                                aria-required="true"
                                aria-describedby="embedded-width-required"
                            />
                            <span
                                id="embedded-width-required"
                                className="rdw-image-mandatory-sign"
                                aria-label="Required field"
                            >
                                *
                            </span>
                        </span>
                    </div>
                </div>
                <div
                    className="rdw-embedded-modal-btn-section"
                    role="group"
                    aria-label="Dialog actions"
                >
                    <button
                        type="button"
                        className="rdw-embedded-modal-btn"
                        onClick={this.onChange}
                        disabled={!embeddedLink || !height || !width}
                        aria-describedby={
                            !embeddedLink || !height || !width
                                ? "embedded-validation-message"
                                : undefined
                        }
                    >
                        {translations["generic.add"]}
                    </button>
                    <button type="button" className="rdw-embedded-modal-btn" onClick={doCollapse}>
                        {translations["generic.cancel"]}
                    </button>
                    {(!embeddedLink || !height || !width) && (
                        <div id="embedded-validation-message" className="rdw-sr-only">
                            All fields are required to add embedded content
                        </div>
                    )}
                </div>
            </div>
        );
    }

    render() {
        const {
            config: { icon, className, title },
            expanded,
            onExpandEvent,
            translations,
        } = this.props;
        return (
            <div
                className="rdw-embedded-wrapper"
                aria-haspopup="dialog"
                aria-expanded={expanded}
                aria-label={
                    translations["components.controls.embedded.embedded"] || "Embedded content"
                }
                role="combobox"
            >
                <Option
                    className={classNames(className)}
                    value="unordered-list-item"
                    onClick={onExpandEvent}
                    title={title || translations["components.controls.embedded.embedded"]}
                >
                    <img src={icon} alt="" />
                </Option>
                {expanded ? this.rendeEmbeddedLinkModal() : undefined}
            </div>
        );
    }
}

export default LayoutComponent;
