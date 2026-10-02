import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ReaderImage from "../../components/ReaderImage/ReaderImage";
import { describe, expect, it } from "vitest";

describe("Reader Image", () => {
  it("shows placeholder when image should not load", () => {
    render(
      <ReaderImage src="image.jpg" alt="chapter page" shouldLoad={false} />,
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(document.querySelector(".reader-image--placeholder")).toBeInTheDocument();
  });
  it("does not render image when shouldLoad is false", () => {
    render(
      <ReaderImage src="image.jpg" alt="chapter page" shouldLoad={false} />,
    );

    expect(screen.queryByAltText("chapter page")).not.toBeInTheDocument()
  });

  it("renders image when shouldLoad is true", async() => {
    render(
      <ReaderImage src="image.jpg" alt="chapter page" shouldLoad={true} />,
    );

    const image = screen.getByRole("img");
    fireEvent.load(image);

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src","image.jpg")
    expect(image).toHaveAttribute("alt","chapter page")
  });

  it("shows error when image fails to load", async() => {
    render(
      <ReaderImage src="image.jpg" alt="chapter page" shouldLoad={true} />,
    );

    const image = screen.getByRole("img");
    fireEvent.error(image)

    await waitFor(()=>{

    expect(screen.getByRole("alert")).toBeInTheDocument()
    })

    expect(screen.getByRole("alert")).toHaveTextContent("Unable to load page")
  });
});
