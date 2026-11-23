import { useState } from "react";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContentRecovery } from "@/components/survey/content-recovery";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Content recovery", () => {
  it("recovers a detached page wrapper without losing the selected page or model", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    function Shell() {
      const [page, setPage] = useState("intro");
      const [model, setModel] = useState("gpt");
      return (
        <ContentRecovery className="contents">
          <button onClick={() => { setPage("experiment"); setModel("claude"); }}>Navigate</button>
          <ContentRecovery key={page}><p>{page}:{model}</p></ContentRecovery>
        </ContentRecovery>
      );
    }
    const { container } = render(<Shell />);
    const content = container.querySelector("p")?.parentElement;
    if (!content) throw new Error("Expected page wrapper");
    content.remove();
    fireEvent.click(screen.getByRole("button", { name: "Navigate" }));
    expect(screen.getByText("experiment:claude")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Navigate" })).toBeInTheDocument();
  });

  it("remounts content after externally removed text causes a deletion error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    function Content() {
      const [visible, setVisible] = useState(true);
      return (
        <>
          <button onClick={() => setVisible(false)}>Hide text</button>
          <p>{visible && "Original text"}<span>Remaining content</span></p>
        </>
      );
    }
    const { container } = render(<ContentRecovery><Content /></ContentRecovery>);
    const text = container.querySelector("p")?.firstChild;
    if (!text || text.nodeType !== Node.TEXT_NODE) throw new Error("Expected a text node");
    text.parentNode?.removeChild(text);
    fireEvent.click(screen.getByRole("button", { name: "Hide text" }));
    expect(screen.getByText("Original text", { exact: false })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Hide text" }));
    expect(screen.getByText("Remaining content")).toBeInTheDocument();
    expect(screen.queryByText("Original text", { exact: false })).not.toBeInTheDocument();
  });

  it("does not suppress unrelated rendering errors", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    function Broken(): never { throw new Error("Unrelated failure"); }
    expect(() => render(<ContentRecovery><Broken /></ContentRecovery>)).toThrow("Unrelated failure");
  });
});