import {ProblemStore} from "@features/warehouse/exception/problem.store.ts";
import {observer} from "mobx-react-lite";

interface IProblemModal {
    mainStore: ProblemStore,
    refreshTable: () => void;
}

export const ProblemModalComponent = observer((props: IProblemModal) => {
    const {mainStore, refreshTable} = props;

    return (
        <>
        </>
    )
});