import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";


export const Dashboard = (): ReactNode => {
    return (
        <div>
            <div className="grid grid-cols-3">
                <Card>
                    <CardContent>3</CardContent>
                </Card>
            </div>
        </div>
    )
}