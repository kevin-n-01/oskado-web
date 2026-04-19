import { Hash } from "lucide-react";
import type React from "react";



const Hashtag = ({ tagText, iconSize }: {tagText: string; iconSize: number}): React.ReactNode => {
    return (
        <div className='flex rounded-lg p-1 gap-1 items-center'>
            <Hash size={iconSize} /><span className='font-mono'>{tagText}</span>
        </div>
    )
}

export default Hashtag;