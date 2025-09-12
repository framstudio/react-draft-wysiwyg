import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Option from "../../../components/Option";
import Spinner from "../../../components/Spinner";
import "./styles.css";

class LayoutComponent extends Component {
    static propTypes = {
        expanded: PropTypes.bool,
        onExpandEvent: PropTypes.func,
        doCollapse: PropTypes.func,
        onChange: PropTypes.func,
        config: PropTypes.object,
        translations: PropTypes.object,
    };

    state = {
        imgSrc: "",
        dragEnter: false,
        uploadHighlighted: this.props.config.uploadEnabled && !!this.props.config.uploadCallback,
        showImageLoading: false,
        height: this.props.config.defaultSize.height,
        width: this.props.config.defaultSize.width,
        alt: "",
    };

    componentDidUpdate(prevProps) {
        const { config } = this.props;
        if (prevProps.expanded && !this.props.expanded) {
            this.setState({
                imgSrc: "",
                dragEnter: false,
                uploadHighlighted: config.uploadEnabled && !!config.uploadCallback,
                showImageLoading: false,
                height: config.defaultSize.height,
                width: config.defaultSize.width,
                alt: "",
            });
        } else if (
            config.uploadCallback !== prevProps.config.uploadCallback ||
            config.uploadEnabled !== prevProps.config.uploadEnabled
        ) {
            this.setState({
                uploadHighlighted: config.uploadEnabled && !!config.uploadCallback,
            });
        }
    }

    onDragEnter = (event) => {
        this.stopPropagation(event);
        this.setState({
            dragEnter: true,
        });
    };

    onImageDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            dragEnter: false,
        });

        // Check if property name is files or items
        // IE uses 'files' instead of 'items'
        let data;
        let dataIsItems;
        if (event.dataTransfer.items) {
            data = event.dataTransfer.items;
            dataIsItems = true;
        } else {
            data = event.dataTransfer.files;
            dataIsItems = false;
        }
        for (let i = 0; i < data.length; i += 1) {
            if ((!dataIsItems || data[i].kind === "file") && data[i].type.match("^image/")) {
                const file = dataIsItems ? data[i].getAsFile() : data[i];
                this.uploadImage(file);
            }
        }
    };

    showImageUploadOption = () => {
        this.setState({
            uploadHighlighted: true,
        });
    };

    addImageFromState = () => {
        const { imgSrc, alt } = this.state;
        let { height, width } = this.state;
        const { onChange } = this.props;
        if (!isNaN(height)) {
            height += "px";
        }
        if (!isNaN(width)) {
            width += "px";
        }
        onChange(imgSrc, height, width, alt);
    };

    showImageURLOption = () => {
        this.setState({
            uploadHighlighted: false,
        });
    };

    toggleShowImageLoading = () => {
        const showImageLoading = !this.state.showImageLoading;
        this.setState({
            showImageLoading,
        });
    };

    updateValue = (event) => {
        this.setState({
            [`${event.target.name}`]: event.target.value,
        });
    };

    selectImage = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            this.uploadImage(event.target.files[0]);
        }
    };

    uploadImage = (file) => {
        this.toggleShowImageLoading();
        const { uploadCallback } = this.props.config;
        uploadCallback(file)
            .then(({ data }) => {
                this.setState({
                    showImageLoading: false,
                    dragEnter: false,
                    imgSrc: data.link || data.url,
                });
                this.fileUpload = false;
            })
            .catch(() => {
                this.setState({
                    showImageLoading: false,
                    dragEnter: false,
                });
            });
    };

    fileUploadClick = (event) => {
        this.fileUpload = true;
        event.stopPropagation();
    };

    stopPropagation = (event) => {
        if (!this.fileUpload) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            this.fileUpload = false;
        }
    };

    renderAddImageModal() {
        const { imgSrc, uploadHighlighted, showImageLoading, dragEnter, height, width, alt } =
            this.state;
        const {
            config: {
                popupClassName,
                uploadCallback,
                uploadEnabled,
                urlEnabled,
                previewImage,
                inputAccept,
                alt: altConf,
            },
            doCollapse,
            translations,
        } = this.props;
        return (
            <div
                className={classNames("rdw-image-modal", popupClassName)}
                onClick={this.stopPropagation}
                role="dialog"
                aria-modal="true"
                aria-label="Image upload dialog"
            >
                <div className="rdw-image-modal-header" role="tablist">
                    {uploadEnabled && uploadCallback && (
                        <span
                            onClick={this.showImageUploadOption}
                            className="rdw-image-modal-header-option"
                            role="tab"
                            aria-selected={uploadHighlighted}
                            tabIndex={uploadHighlighted ? 0 : -1}
                        >
                            {translations["components.controls.image.fileUpload"]}
                            <span
                                className={classNames("rdw-image-modal-header-label", {
                                    "rdw-image-modal-header-label-highlighted": uploadHighlighted,
                                })}
                            />
                        </span>
                    )}
                    {urlEnabled && (
                        <span
                            onClick={this.showImageURLOption}
                            className="rdw-image-modal-header-option"
                            role="tab"
                            aria-selected={!uploadHighlighted}
                            tabIndex={!uploadHighlighted ? 0 : -1}
                        >
                            {translations["components.controls.image.byURL"]}
                            <span
                                className={classNames("rdw-image-modal-header-label", {
                                    "rdw-image-modal-header-label-highlighted": !uploadHighlighted,
                                })}
                            />
                        </span>
                    )}
                </div>
                {uploadHighlighted ? (
                    <div
                        onClick={this.fileUploadClick}
                        role="tabpanel"
                        aria-label="File upload options"
                    >
                        <div
                            onDragEnter={this.onDragEnter}
                            onDragOver={this.stopPropagation}
                            onDrop={this.onImageDrop}
                            className={classNames("rdw-image-modal-upload-option", {
                                "rdw-image-modal-upload-option-highlighted": dragEnter,
                            })}
                            role="button"
                            tabIndex={0}
                            aria-label="Drop image files here or click to select"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    document.getElementById("file").click();
                                }
                            }}
                        >
                            <label htmlFor="file" className="rdw-image-modal-upload-option-label">
                                {previewImage && imgSrc ? (
                                    <img
                                        src={imgSrc}
                                        alt="Image preview"
                                        className="rdw-image-modal-upload-option-image-preview"
                                    />
                                ) : (
                                    imgSrc || translations["components.controls.image.dropFileText"]
                                )}
                            </label>
                        </div>
                        <input
                            type="file"
                            id="file"
                            accept={inputAccept}
                            onChange={this.selectImage}
                            className="rdw-image-modal-upload-option-input"
                            aria-label="Select image file"
                        />
                    </div>
                ) : (
                    <div
                        className="rdw-image-modal-url-section"
                        role="tabpanel"
                        aria-label="Image URL options"
                    >
                        <label htmlFor="image-url-input" className="rdw-sr-only">
                            {translations["components.controls.image.enterlink"]}
                        </label>
                        <input
                            id="image-url-input"
                            className="rdw-image-modal-url-input"
                            placeholder={translations["components.controls.image.enterlink"]}
                            name="imgSrc"
                            onChange={this.updateValue}
                            onBlur={this.updateValue}
                            value={imgSrc}
                            aria-required="true"
                            aria-describedby="image-url-required"
                        />
                        <span
                            id="image-url-required"
                            className="rdw-image-mandatory-sign"
                            aria-label="Required field"
                        >
                            *
                        </span>
                    </div>
                )}
                {altConf.present && (
                    <div className="rdw-image-modal-size">
                        <label htmlFor="image-alt-input" className="rdw-image-modal-alt-lbl">
                            Alt Text
                        </label>
                        <input
                            id="image-alt-input"
                            onChange={this.updateValue}
                            onBlur={this.updateValue}
                            value={alt}
                            name="alt"
                            className="rdw-image-modal-alt-input"
                            placeholder="alt"
                            aria-required={altConf.mandatory}
                            aria-describedby={altConf.mandatory ? "image-alt-required" : undefined}
                        />
                        {altConf.mandatory && (
                            <span
                                id="image-alt-required"
                                className="rdw-image-mandatory-sign"
                                aria-label="Required field"
                            >
                                *
                            </span>
                        )}
                    </div>
                )}
                <div className="rdw-image-modal-size">
                    <span aria-label="Height">&#8597;</span>&nbsp;
                    <label htmlFor="image-height-input" className="rdw-sr-only">
                        Height
                    </label>
                    <input
                        id="image-height-input"
                        onChange={this.updateValue}
                        onBlur={this.updateValue}
                        value={height}
                        name="height"
                        className="rdw-image-modal-size-input"
                        placeholder="Height"
                        aria-required="true"
                        aria-describedby="image-height-required"
                    />
                    <span
                        id="image-height-required"
                        className="rdw-image-mandatory-sign"
                        aria-label="Required field"
                    >
                        *
                    </span>
                    &nbsp;<span aria-label="Width">&#8596;</span>&nbsp;
                    <label htmlFor="image-width-input" className="rdw-sr-only">
                        Width
                    </label>
                    <input
                        id="image-width-input"
                        onChange={this.updateValue}
                        onBlur={this.updateValue}
                        value={width}
                        name="width"
                        className="rdw-image-modal-size-input"
                        placeholder="Width"
                        aria-required="true"
                        aria-describedby="image-width-required"
                    />
                    <span
                        id="image-width-required"
                        className="rdw-image-mandatory-sign"
                        aria-label="Required field"
                    >
                        *
                    </span>
                </div>
                <div
                    className="rdw-image-modal-btn-section"
                    role="group"
                    aria-label="Dialog actions"
                >
                    <button
                        className="rdw-image-modal-btn"
                        onClick={this.addImageFromState}
                        disabled={!imgSrc || !height || !width || (altConf.mandatory && !alt)}
                        aria-describedby={
                            !imgSrc || !height || !width || (altConf.mandatory && !alt)
                                ? "image-validation-message"
                                : undefined
                        }
                    >
                        {translations["generic.add"]}
                    </button>
                    <button className="rdw-image-modal-btn" onClick={doCollapse}>
                        {translations["generic.cancel"]}
                    </button>
                    {(!imgSrc || !height || !width || (altConf.mandatory && !alt)) && (
                        <div id="image-validation-message" className="rdw-sr-only">
                            All required fields must be filled to add image
                        </div>
                    )}
                </div>
                {showImageLoading ? (
                    <div
                        className="rdw-image-modal-spinner"
                        role="status"
                        aria-label="Uploading image"
                    >
                        <Spinner />
                    </div>
                ) : undefined}
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
                className="rdw-image-wrapper"
                aria-haspopup="dialog"
                aria-expanded={expanded}
                aria-label={translations["components.controls.image.image"] || "Image picker"}
                role="combobox"
            >
                <Option
                    className={classNames(className)}
                    value="unordered-list-item"
                    onClick={onExpandEvent}
                    title={title || translations["components.controls.image.image"]}
                >
                    <img src={icon} alt="" />
                </Option>
                {expanded ? this.renderAddImageModal() : undefined}
            </div>
        );
    }
}

export default LayoutComponent;
