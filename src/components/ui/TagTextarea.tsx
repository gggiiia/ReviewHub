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
    value?: string; // serialized form with [[value]] for tags
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

    // Convert [[tag]] syntax into HTML with a non-editable span for each tag
    const renderHTML = (text: string) => {
        return text.replace(/\[\[(.*?)\]\]/g, (_, tagValue) => {
            const tag = tags.find((t) => t.value === tagValue);
            if (!tag) return `[[${tagValue}]]`;
            // data-tag used to map back to [[value]]
            return `<span contenteditable="false" data-tag="${escapeHtml(
                tag.value
            )}" class="inline-block bg-primary text-primary-foreground text-sm font-medium px-2 py-0.5 rounded-xl cursor-pointer mx-0.50 hover:bg-destructive" role="button" aria-label="${escapeHtml(
                tag.label
            )}">${escapeHtml(tag.label)}</span>`;
        });
    };

    // Escape helper to avoid injecting arbitrary HTML
    function escapeHtml(s: string) {
        return s
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    // Walk the editor DOM and reconstruct the serialized text (with [[value]] for tags)
    const getTextValue = (el: HTMLElement) => {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_ALL);
        let result = "";
        while (walker.nextNode()) {
            const node = walker.currentNode!;

            if (node.parentNode?.getAttribute("contenteditable") === "false") {
                continue
            }

            if (node.nodeType === Node.TEXT_NODE) {
                result += node.textContent;
            } else if (
                node.nodeType === Node.ELEMENT_NODE &&
                (node as HTMLElement).dataset.tag
            ) {
                result += `[[${(node as HTMLElement).dataset.tag}]]`;
            }
        }
        return result;
    };

    // Sync editor HTML when external `value` changes
    useEffect(() => {
        const el = editorRef.current;
        if (!el) return;
        const currentSerialized = getTextValue(el);
        if (currentSerialized !== value) {
            el.innerHTML = renderHTML(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, tags]);

    // Called on input events
    const handleInput = () => {
        const el = editorRef.current;
        if (!el) return;
        const textValue = getTextValue(el);
        onChange?.(textValue);
    };

    // When clicking a tag inside editor, remove it
    const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        // If clicked element (or ancestor) has data-tag, remove that span node
        const tagEl = findAncestorWithDataTag(target);
        if (tagEl) {
            tagEl.remove();
            // After removal, ensure we update value
            handleInput();
            // Place caret where the tag was (after the removed node)
            placeCaretAtElement(tagEl.nextSibling || editorRef.current);
        }
    };

    const findAncestorWithDataTag = (el: Element | null): HTMLElement | null => {
        while (el && el !== editorRef.current) {
            if ((el as HTMLElement).dataset && (el as HTMLElement).dataset.tag) {
                return el as HTMLElement;
            }
            el = el.parentElement;
        }
        return null;
    };

    // Utility: place caret at a node (node may be null)
    const placeCaretAtElement = (node: Node | null) => {
        const sel = window.getSelection();
        if (!sel) return;
        sel.removeAllRanges();
        const range = document.createRange();
        if (!node) {
            // empty editor -> put caret at end
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
    };

    // Insert a tag into the editor at the caret. Guarantees insertion happens inside editor.
    const insertTag = (tag: Tag) => {
        const el = editorRef.current;
        if (!el) return;

        // Ensure editor has focus
        el.focus();

        const selection = window.getSelection();
        let range: Range | null = null;

        if (selection && selection.rangeCount > 0) {
            const candidate = selection.getRangeAt(0);
            // Ensure the selection/caret is inside the editor; otherwise we will move caret to end
            if (el.contains(candidate.startContainer)) {
                range = candidate.cloneRange();
            }
        }

        if (!range) {
            // place caret at end of editor
            range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
        }

        // Create the tag node (non-editable)
        const span = document.createElement("span");
        span.contentEditable = "false";
        span.dataset.tag = tag.value;
        span.className =
            "inline-block bg-primary text-primary-foreground text-sm font-medium px-2 py-0.5 rounded-xl cursor-pointer mx-0.5 hover:bg-destructive";
        span.setAttribute("role", "button");
        span.setAttribute("aria-label", tag.label);
        span.innerText = `${tag.label}`;

        // Insert the span
        range.deleteContents();
        range.insertNode(span);

        // Move caret after the inserted span
        const afterRange = document.createRange();
        afterRange.setStartAfter(span);
        afterRange.collapse(true);

        const sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(afterRange);
        }

        // Trigger change
        handleInput();
        // keep focus on editor
        el.focus();
    };

    // Buttons: onMouseDown prevents the button from taking focus,
    // so the editor retains the caret. Use onClick to actually insert.
    return (
        <div className={`flex flex-col gap-3 w-full ${className}`}>
            <div
                ref={editorRef}
                onInput={handleInput}
                onClick={handleEditorClick}
                contentEditable
                suppressContentEditableWarning
                className={cn(TextareaClasses,"whitespace-break-spaces")}
                data-placeholder={placeholder}
                // render initial content
                dangerouslySetInnerHTML={{__html: renderHTML(value)}}
            />

            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Button
                        key={tag.value}
                        // preventDefault on mouseDown so the button doesn't steal focus/selection
                        onMouseDown={(e) => {
                            e.preventDefault();
                        }}
                        onClick={() => insertTag(tag)}
                        variant={"outline"}
                        aria-label={`Insert ${tag.label}`}
                    >
                        <Plus/>
                        {tag.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};
