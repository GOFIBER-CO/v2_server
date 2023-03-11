import { Skeleton, TableColumnProps } from 'antd'

export const renderTableSkeleton = (
    columns: {
        title: string
        type: string
        width: number
    }[]
) => {
    const skeleton = columns.map((column, index) => {
        let renderContent: any = null

        switch (column.type) {
            case 'image':
                renderContent = (
                    <>
                        <Skeleton.Image style={{ width: 60, height: 60 }} />
                        <Skeleton.Input
                            size="small"
                            style={{ width: column.width }}
                            active
                        />
                    </>
                )
                break
            case 'button':
                renderContent = <Skeleton.Button active size="small" />
                break
            case 'banner':
                renderContent = (
                    <Skeleton.Image
                        style={{ width: column.width, height: 110 }}
                    />
                )
                break
            default:
                renderContent = (
                    <Skeleton.Input
                        size="small"
                        style={{ width: column.width }}
                        active
                    />
                )
        }

        const result = {
            title: column.title,
            key: index.toString(),
            render: () => renderContent,
        }

        return result
    })
    return skeleton
}
