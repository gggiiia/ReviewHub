import React, {useRef, useEffect} from "react";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {TextareaClasses} from "@/components/ui/textarea.tsx";
import {cn} from "@/lib/utils.ts";

type Tag = {
    value: string;
    label: string;
};

type TagTextareaV2Props = {
    tags: Tag[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
};

export const TagTextarea: React.FC<TagTextareaV2Props> = ({
                                                              tags,
                                                              value = "",
                                                              onChange,
                                                              placeholder = "Type here...",
                                                              className = "",
                                                          }) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const caretRangeRef = useRef<Range | null>(null); // store last caret

    const renderHTML = (text: string) => {
        return text.replace(/\[\[(.*?)\]\]/g, (_, tagValue) => {
            const tag = tags.find((t) => t.value === tagValue);
            if (!tag) return `[[${tagValue}]]`;
            return `<span contenteditable="false" data-tag="${escapeHtml(
                tag.value
            )}" class="inline-block bg-primary text-primary-foreground text-sm font-medium px-2 py-0.5 rounded-xl  mx-0.50 h" role="button" aria-label="${escapeHtml(
                tag.label
            )}">${escapeHtml(tag.label)}</span>`;
        });
    };

    function escapeHtml(s: string) {
        return s
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    const getTextValue = (el: HTMLElement) => {
        let result = "";

        el.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                result += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const elNode = node as HTMLElement;

                if (elNode.dataset.tag) {
                    // Tags -> [[value]]
                    result += `[[${elNode.dataset.tag}]]`;
                } else if (elNode.tagName === "BR") {
                    result += "\n";
                } else if (elNode.tagName === "DIV" || elNode.tagName === "P") {
                    // For div/p, treat as line break
                    result += getTextValue(elNode) + "\n";
                } else {
                    result += getTextValue(elNode);
                }
            }
        });

        return result;
    };

    useEffect(() => {
        const el = editorRef.current;
        if (!el) return;
        const currentSerialized = getTextValue(el);
        if (currentSerialized !== value) {
            el.innerHTML = renderHTML(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, tags]);

    const handleInput = () => {
        const el = editorRef.current;
        if (!el) return;
        const textValue = getTextValue(el);

        console.log("handleInput",textValue)

        onChange?.(textValue);
    };

    const handleEditorClick = () => {
        saveCaret();
    };

    const saveCaret = () => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        caretRangeRef.current = sel.getRangeAt(0).cloneRange();
    };

    const restoreCaret = () => {
        const sel = window.getSelection();
        const range = caretRangeRef.current;
        if (!sel || !range) return;
        sel.removeAllRanges();
        sel.addRange(range);
    };

    const findAncestorWithDataTag = (el: Element | null): HTMLElement | null => {
        while (el && el !== editorRef.current) {
            if ((el as HTMLElement).dataset && (el as HTMLElement).dataset.tag) return el as HTMLElement;
            el = el.parentElement;
        }
        return null;
    };

    const placeCaretAtElement = (node: Node | null) => {
        const sel = window.getSelection();
        if (!sel) return;
        sel.removeAllRanges();
        const range = document.createRange();
        if (!node) {
            const el = editorRef.current!;
            range.selectNodeContents(el);
            range.collapse(false);
        } else if (node.nodeType === Node.TEXT_NODE) {
            range.setStart(node, node.textContent?.length ?? 0);
            range.collapse(true);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            range.setStartAfter(node);
            range.collapse(true);
        } else {
            const el = editorRef.current!;
            range.selectNodeContents(el);
            range.collapse(false);
        }
        sel.addRange(range);
        saveCaret(); // always save after moving
    };

    const insertTag = (tag: Tag) => {
        const el = editorRef.current;
        if (!el) return;

        el.focus();
        restoreCaret(); // restore last caret position

        const selection = window.getSelection();
        let range: Range | null = null;
        if (selection && selection.rangeCount > 0) {
            const candidate = selection.getRangeAt(0);
            if (el.contains(candidate.startContainer)) range = candidate.cloneRange();
        }
        if (!range) {
            range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
        }

        const span = document.createElement("span");
        span.contentEditable = "false";
        span.dataset.tag = tag.value;
        span.className =
            "inline-block bg-primary text-primary-foreground text-sm font-medium px-2 py-0.5 rounded-xl  mx-0.5";
        span.setAttribute("role", "button");
        span.setAttribute("aria-label", tag.label);
        span.innerText = `${tag.label}`;

        range.deleteContents();
        range.insertNode(span);

        // Move caret after inserted tag
        const afterRange = document.createRange();
        afterRange.setStartAfter(span);
        afterRange.collapse(true);

        const sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(afterRange);
        }
        saveCaret(); // save caret after insertion

        el.focus();
    };

    return (
        <div className={`flex flex-col gap-3 w-full ${className}`}>
            <div
                ref={editorRef}
                onBlur={handleInput}
                onClick={handleEditorClick}
                onKeyUp={saveCaret}
                contentEditable
                suppressContentEditableWarning
                className={cn(TextareaClasses, "whitespace-break-spaces")}
                data-placeholder={placeholder}
                dangerouslySetInnerHTML={{__html: renderHTML(value)}}
            />
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Button
                        key={tag.value}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => insertTag(tag)}
                        variant={"outline"}
                        aria-label={`Insert ${tag.label}`}
                    >
                        <Plus />
                        {tag.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};
