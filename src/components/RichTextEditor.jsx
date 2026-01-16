import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
    Bold, Italic, Strikethrough, List, ListOrdered,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Quote, Image as ImageIcon
} from 'lucide-react';
import { Button } from './ui/button';

const MenuBar = ({ editor, onImageUpload }) => {
    const fileInputRef = React.useRef(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (file && onImageUpload) {
            try {
                const url = await onImageUpload(file);
                if (url) {
                    editor.chain().focus().setImage({ src: url }).run();
                }
            } catch (error) {
                console.error("Failed to upload image:", error);
                // Optionally show toast error here if supported
            }
        }
        // Reset input
        event.target.value = '';
    };
    if (!editor) {
        return null;
    }

    return (
        <div className="border border-b-0 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
            {/* Headings */}
            <select
                onChange={(e) => {
                    const level = parseInt(e.target.value);
                    if (level === 0) {
                        editor.chain().focus().setParagraph().run();
                    } else {
                        editor.chain().focus().toggleHeading({ level }).run();
                    }
                }}
                className="px-2 py-1 border rounded text-sm"
                value={
                    editor.isActive('heading', { level: 1 }) ? 1 :
                        editor.isActive('heading', { level: 2 }) ? 2 :
                            editor.isActive('heading', { level: 3 }) ? 3 :
                                editor.isActive('heading', { level: 4 }) ? 4 :
                                    editor.isActive('heading', { level: 5 }) ? 5 :
                                        editor.isActive('heading', { level: 6 }) ? 6 : 0
                }
            >
                <option value="0">Normal</option>
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
                <option value="4">Heading 4</option>
                <option value="5">Heading 5</option>
                <option value="6">Heading 6</option>
            </select>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Text Formatting */}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-secondary/30' : ''}
            >
                <Bold className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'bg-secondary/30' : ''}
            >
                <Italic className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'bg-secondary/30' : ''}
            >
                <Strikethrough className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'bg-secondary/30' : ''}
            >
                <Quote className="w-4 h-4" />
            </Button>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            {onImageUpload && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleImageClick}
                    title="Insert Image"
                >
                    <ImageIcon className="w-4 h-4" />
                </Button>
            )}

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Lists */}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'bg-secondary/30' : ''}
            >
                <List className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'bg-secondary/30' : ''}
            >
                <ListOrdered className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Text Alignment */}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={editor.isActive({ textAlign: 'left' }) ? 'bg-secondary/30' : ''}
            >
                <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={editor.isActive({ textAlign: 'center' }) ? 'bg-secondary/30' : ''}
            >
                <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={editor.isActive({ textAlign: 'right' }) ? 'bg-secondary/30' : ''}
            >
                <AlignRight className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={editor.isActive({ textAlign: 'justify' }) ? 'bg-secondary/30' : ''}
            >
                <AlignJustify className="w-4 h-4" />
            </Button>
        </div>
    );
};

const RichTextEditor = ({ value, onChange, placeholder, onImageUpload }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
            }),
            Image,
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] max-h-[500px] overflow-y-auto p-4',
            },
        },
    });

    // Update editor content when value changes externally
    React.useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    return (
        <div className="border rounded-md">
            <MenuBar editor={editor} onImageUpload={onImageUpload} />
            <div className="border-t">
                <EditorContent editor={editor} placeholder={placeholder} />
            </div>
        </div>
    );
};

export default RichTextEditor;
