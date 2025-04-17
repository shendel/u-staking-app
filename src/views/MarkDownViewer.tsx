import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";

const MarkdownRenderer = ({ url }) => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    // Загружаем Markdown-файл по URL
    const fetchMarkdown = async () => {
      try {
        console.log('>>>> MarkDownViewer - begin load', url)
        const response = await axios.get(url);
        setMarkdown(response.data); // Сохраняем содержимое файла
        console.log('>>> Is loaded')
      } catch (error) {
        console.error("Ошибка при загрузке Markdown:", error);
        setMarkdown("Ошибка загрузки Markdown-файла.");
      }
    };

    fetchMarkdown();
  }, [url]);

  return (
    <div className="markdown-container">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
};

const MarkDownViewer = (url) => {
  return (props) => {
    return new MarkdownRenderer({ url })
  }
}
export default MarkDownViewer