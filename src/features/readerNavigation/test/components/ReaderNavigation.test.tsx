import { describe, expect, it, vi } from "vitest";
import ReaderNavigation from "../../components/ReaderNavigation";
import { render,screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"

describe("ReaderNavigation",()=>{
    it("renders Previous, Current Chapter, and Next buttons",()=>{

        const onPrevious = vi.fn()
        const onNext =vi.fn()

        render(
            <ReaderNavigation hasPrevious={true} hasNext={true} onPrevious={onPrevious} onNext={onNext} navigationStatus="idle"/>
        )

        expect(
            screen.getByRole("button",{
                name:"Previous Button"
            })
        ).toBeInTheDocument()

        expect(screen.getByText("Current Chapter")).toBeInTheDocument()
        expect(screen.getByRole("button",{
            name:"Next Chapter",
        })).toBeInTheDocument()
        
    })

    it("calls onPrevious When  Previous Button is clicked",async()=>{
        const user = userEvent.setup()

        const onPrevious = vi.fn()
        const onNext = vi.fn()

        render(<ReaderNavigation hasPrevious={true} hasNext={true} onPrevious={onPrevious} onNext={onNext} navigationStatus="idle"/>)
        
        const previousButton = screen.getByRole("button",{
            name:"Previous Button",
        })

        await user.click(previousButton)

        expect(onPrevious).toHaveBeenCalledTimes(1);
        expect(onNext).not.toHaveBeenCalled()
    })

    it("calls on Next when Next Chapter is clicked", async()=>{
        const user = userEvent.setup();

        const onPrevious = vi.fn();
        const onNext = vi.fn()

        render(<ReaderNavigation hasPrevious={true} hasNext={true} onPrevious={onPrevious} onNext={onNext} navigationStatus="idle"/>)

        const nextButton = screen.getByRole("button",{
            name:"Next Chapter"
        })

        await user.click(nextButton)
        expect(onNext).toHaveBeenCalledTimes(1)
        expect(onPrevious).not.toHaveBeenCalled()
    })

    it("disables Previous Button when there is no previous chapter",()=>{
        const onPrevious = vi.fn()
        const onNext=vi.fn()

        render(<ReaderNavigation
            hasPrevious={false}
            hasNext={true}
            onPrevious={onPrevious}
            onNext={onNext}
            navigationStatus="idle"
        />)

        const previousButton = screen.getByRole("button",{
            name:"Previous Button"
        })

        expect(previousButton).toBeDisabled()
    })

    it("shows Loading and disasbles Previous Button while  loading",()=>{
        const onPrevious = vi.fn()
        const onNext= vi.fn()

        render(
            <ReaderNavigation hasPrevious={true} hasNext={true} onPrevious={onPrevious} onNext={onNext} navigationStatus="loading"/>
        )

        const previousButton = screen.getByRole("button",{
            name:"Loading"
        })

        expect(previousButton).toBeDisabled()
    })

    it("it shows an error message when navigation fails",()=>{
        const onPrevious = vi.fn()
        const onNext = vi.fn()

        render(
            <ReaderNavigation hasPrevious={true} hasNext={true} onPrevious={onPrevious} onNext={onNext} navigationStatus="error"/>
        )

        expect(screen.getByRole("alert")).toHaveTextContent("Failed to load previous chapter")
    })

    
})