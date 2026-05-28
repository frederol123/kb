import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
import { useEffect, useCallback } from 'react';

// Кастомное расширение размера шрифта (font-size)
const FontSize = Extension.create({
    name: 'fontSize',

    addOptions() {
        return { types: ['textStyle'] };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: el => el.style.fontSize || null,
                        renderHTML: attrs => {
                            if (!attrs.fontSize) return {};
                            return { style: `font-size: ${attrs.fontSize}` };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setFontSize:
                (fontSize) =>
                ({ chain }) =>
                    chain().setMark('textStyle', { fontSize }).run(),
            unsetFontSize:
                () =>
                ({ chain }) =>
                    chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
        };
    },
});

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px'];

function ToolbarButton({ onClick, active, title, disabled, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-1.5 rounded-md text-sm transition-colors
                ${active
                    ? 'bg-[#1e79d0] text-white'
                    : 'text-[#555] hover:bg-gray-100 hover:text-[#1e79d0]'
                }
                ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div className="w-px h-6 bg-gray-200 mx-1 flex-shrink-0" />;
}

export default function RichTextEditor({ content, onChange, placeholder = 'Напишите биографию...' }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-[#1e79d0] underline' },
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            FontSize,
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none min-h-[280px] px-4 py-3 outline-none text-[#1c2145]',
            },
        },
    });

    // Синхронизация внешнего контента (при загрузке карточки)
    useEffect(() => {
        if (editor && content !== undefined && editor.getHTML() !== content) {
            editor.commands.setContent(content || '', false);
        }
    }, [content, editor]);

    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL ссылки:', previousUrl || 'https://');
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const setFontSize = useCallback(
        (size) => {
            if (!editor) return;
            if (size === editor.getAttributes('textStyle').fontSize) {
                editor.chain().focus().unsetFontSize().run();
            } else {
                editor.chain().focus().setFontSize(size).run();
            }
        },
        [editor],
    );

    if (!editor) return null;

    return (
        <div className="rich-editor border border-[#cfd9e8] rounded-xl overflow-hidden bg-white focus-within:border-[#1e79d0] focus-within:ring-1 focus-within:ring-[#1e79d0]/20 transition-all">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-gray-100 bg-[#f8faff]">
                {/* Undo / Redo */}
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Отменить">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Вернуть">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                    </svg>
                </ToolbarButton>
                <Divider />

                {/* Bold / Italic / Underline / Strike */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Жирный (Ctrl+B)">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Курсив (Ctrl+I)">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Подчёркнутый (Ctrl+U)">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Зачёркнутый">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.85 7.08C6.85 4.37 9.45 3 12.24 3c1.64 0 3 .49 3.9 1.28.77.65 1.46 1.73 1.46 3.24h-3.01c0-.31-.05-.59-.15-.85-.29-.86-1.2-1.28-2.25-1.28-1.86 0-2.34 1.02-2.34 1.7 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.21-.34-.54-.89-.54-1.92zM21 12v-2H3v2h9.62c1.15.45 1.96.75 1.96 1.97 0 1-.81 1.67-2.28 1.67-1.54 0-2.93-.54-2.93-2.51H6.4c0 .55.08 1.13.24 1.58.81 2.29 3.29 3.3 5.67 3.3 2.27 0 5.3-.89 5.3-4.05 0-.3-.01-1.16-.48-1.94H21V12z" /></svg>
                </ToolbarButton>
                <Divider />

                {/* Headings */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Заголовок 1">
                    <span className="font-bold text-[15px]">H1</span>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Заголовок 2">
                    <span className="font-bold text-[13px]">H2</span>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Заголовок 3">
                    <span className="font-bold text-[12px]">H3</span>
                </ToolbarButton>
                <Divider />

                {/* Font size */}
                {FONT_SIZES.map((size) => {
                    const isActive = editor.getAttributes('textStyle').fontSize === size;
                    return (
                        <ToolbarButton
                            key={size}
                            onClick={() => setFontSize(size)}
                            active={isActive}
                            title={`Размер шрифта ${size}`}
                        >
                            <span className="text-[11px] font-semibold">{size.replace('px', '')}</span>
                        </ToolbarButton>
                    );
                })}
                <Divider />

                {/* Text align */}
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="По левому краю">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="По центру">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="По правому краю">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 15h12v-2H3v2zm0 8h18v-2H3v2zm0-8h18v-2H3v2zm0-8h12V5H3v2zm0 8h18v-2H3v2z" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="По ширине">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 15h18v-2H3v2zm0 8h18v-2H3v2zm0-8h18v-2H3v2zm0-8h18V5H3v2zm0 8h18v-2H3v2z" /></svg>
                </ToolbarButton>
                <Divider />

                {/* Lists */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Маркированный список">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" /></svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Нумерованный список">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" /></svg>
                </ToolbarButton>
                <Divider />

                {/* Blockquote */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Цитата">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" /></svg>
                </ToolbarButton>

                {/* Horizontal rule */}
                <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Горизонтальная линия">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 11h20v2H2z" /></svg>
                </ToolbarButton>
                <Divider />

                {/* Link */}
                <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Вставить ссылку">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" /></svg>
                </ToolbarButton>

                {/* Clear formatting */}
                <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Очистить форматирование">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21 18 19.73 3.55 5.27 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z" /></svg>
                </ToolbarButton>
            </div>

            {/* Editor content */}
            <EditorContent editor={editor} />
        </div>
    );
}
