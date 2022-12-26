import { createContext, ReactNode, useContext, useState } from 'react'

interface IInitLayout {
    loading: boolean
    modal: {
        isOpen: boolean
        dispatchFunction: () => void
        content: string
        title: string
    }
}

interface ILayoutProvider {
    setLoading: (status: boolean) => void
    loading: boolean
    modal: {
        isOpen: boolean
        dispatchFunction: () => void
        content: string
        title: string
    }
    setModal: (
        isOpen: boolean,
        dispatchFunction: () => void,
        content: string,
        title: string
    ) => void
}

const initLayout: ILayoutProvider = {
    loading: false,
    setLoading: (status: boolean) => {},
    modal: {
        isOpen: false,
        content: '',
        dispatchFunction: () => {},
        title: '',
    },
    setModal: (
        isOpen: boolean,
        dispatchFunction: () => void,
        content: string,
        title: string
    ) => {},
}

const layoutContext = createContext(initLayout)

export const LayoutProvider = ({ child }: { child: ReactNode }) => {
    const layout = useLayoutProvider()
    return (
        <layoutContext.Provider value={layout}>{child}</layoutContext.Provider>
    )
}

export const useLayoutInit = () => {
    return useContext(layoutContext)
}

const useLayoutProvider = (): ILayoutProvider => {
    const [layout, setLayout] = useState<IInitLayout>({
        loading: false,
        modal: {
            isOpen: false,
            content: '',
            dispatchFunction: () => {},
            title: '',
        },
    })

    const setLoading = (status: boolean) => {
        setLayout({
            ...layout,
            loading: status,
        })
    }

    const setModal = (
        isOpen: boolean,
        dispatchFunction: () => void,
        content: string,
        title: string
    ) => {
        setLayout({
            ...layout,
            modal: {
                isOpen: isOpen,
                dispatchFunction: dispatchFunction,
                content: content,
                title: title,
            },
        })
    }

    return {
        ...layout,
        setLoading,
        setModal,
    }
}
