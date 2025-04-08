import { Copy } from "lucide-react"

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
            <DialogTrigger asChild>
                <Button onClick={handleGetPrompts} variant="secondary">Generate Prompts</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                <DialogTitle>
                    Prompts
                </DialogTitle>
                <DialogDescription>
                </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                { promptsLoading 
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
                                        <Card className="space-y-4 my-2" key={index}>
                                            <CardContent key={index} className="flex pt-4">
                                                <div className="text-md font-light">{prompt}</div>
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