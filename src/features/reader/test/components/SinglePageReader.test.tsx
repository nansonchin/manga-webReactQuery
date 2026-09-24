import { describe, expect, it, vi } from "vitest";
import SinglePageReader from "../../components/SinglePageReader/SinglePageReader";
import { render,screen } from "@testing-library/react";

vi.mock("../../components/ReaderImage/ReaderImage",()=>({
    default:({
        src,
        alt,
        shouldLoad,
    }:{
        src:string;
        alt:string;
        shouldLoad:boolean;
    })=>(
        <img src={src} alt={alt} data-should-load={String(shouldLoad)}/>
    )
}))
describe("SinglePageReader", () => {
  const pages = [
    {
      index: 0,
      url: "page-0.jpg",
    },
    {
      index: 1,
      url: "page-1.jpg",
    },
    {
      index: 2,
      url: "page-2.jpg",
    },
  ];


  it("renders all pages",()=>{
    render(<SinglePageReader pages={pages} currentPage={0} onNextPage={vi.fn()} onPreviousPage={vi.fn()}/>)
  
    expect(screen.getAllByAltText("Page 1"))
    expect(screen.getAllByAltText("Page 2"))
    expect(screen.getAllByAltText("Page 3"))

})

});
