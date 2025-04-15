import { Copy, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SkeletonContainer } from "@/components/SkeletonContainer"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";

interface IGeneratePromptsBtnProps {
    handleGetPrompts: () => void,
    promptsLoading: boolean,
    prompts: string[],
    setPrompt: (prompt: string) => void,
}

export default function GeneratePromptsBtn({ handleGetPrompts, promptsLoading, prompts, setPrompt }: IGeneratePromptsBtnProps) {
    useEffect(() => { console.log({ promptsLoading})    }, [promptsLoading])
    return (
            <Dialog>
            <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                <Button type="button" onClick={handleGetPrompts} variant="ghost" size="icon">
                                    <Pencil className="size-4" />
                                    <span className="sr-only">Generate Prompts</span>
                                </Button>
                                </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="top">Generate Prompts</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            <DialogContent className="sm:max-w-md flex flex-col w-full">
                <DialogHeader className="items-center ">
                    <DialogTitle className="text-md font-medium">
                        {promptsLoading ? "Loading..." : "Select a Prompt"}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    { 
                        promptsLoading 
                            ? (
                                <div className='my-3'>
                                    <SkeletonContainer />
                                    <SkeletonContainer />
                                    <SkeletonContainer />
                                </div>
                            )
                            : (
                                <div>
                                    {prompts.map((prompt, index) => (
                                        <DialogClose 
                                            className="hover:border hover:border-primary shadow:sm hover:cursor-pointer hover:bg-secondary" asChild key={index}
                                            onClick={() => setPrompt(prompt)}
                                            >
                                            <Card className="space-y-4 my-2 shadow-none" key={index}>
                                                <CardContent key={index} className="flex pt-4">
                                                    <div className="text-sm font-light">{prompt}</div>
                                                </CardContent>
                                            </Card>
                                        </DialogClose>
                                    ))}
                                </div>
                            )
                        }
                </div>
                <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Close</Button>
                </DialogClose>
                <Button type="button" size="sm" className="px-3 mt-1">
                    Refresh Prompts
                </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
    )
}