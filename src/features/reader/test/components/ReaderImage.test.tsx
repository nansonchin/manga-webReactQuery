import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ReaderImage from "../../components/ReaderImage/ReaderImage";
import { describe, expect, it } from "vitest";

describe("Reader Image", () => {
  it("shows placeholder when image should not load", () => {
    render(
      <ReaderImage src="image.jpg" alt="chapter page" shouldLoad={false} />,
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(document.querySelector(".reader-placeholder")).toBeInTheDocument();
  });
  it("shows skeleton while image is loading", () => {
    render(
      <ReaderImage src="image.jpg" alt="chapter page" shouldLoad={true} />,
    );

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(
      document.querySelector(".reader-image-skeleton"),
    ).toBeInTheDocument();
  });

  it("hides skeleton after image loads", async() => {
    render(
      <ReaderImage src="image.jpg" alt="chapter page" shouldLoad={true} />,
    );

    const image = screen.getByRole("img");
    fireEvent.load(image);

    await waitFor(() => {
      expect(
        document.querySelector(".reader-image-skeleton"),
      ).not.toBeInTheDocument();
    });

    expect(image).toHaveClass("loaded");
  });

  it("shows error when image fails to load", async() => {
    render(
      <ReaderImage src="image.jpg" alt="chapter page" shouldLoad={true} />,
    );

    const image = screen.getByRole("img");
    image.dispatchEvent(new Event("error"));

    await waitFor(()=>{

    expect(screen.getByRole("alert")).toHaveTextContent("Failed to load Image");
    })
  });
});
