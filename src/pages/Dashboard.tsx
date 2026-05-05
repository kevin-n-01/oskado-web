import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";


export const Dashboard = (): ReactNode => {

    
    return (
        <div>
            <div className="grid grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Current Active Inventory
                        </CardTitle>
                    </CardHeader>
                    <CardContent>3</CardContent>
                </Card>
            </div>
        </div>
    )
}