type SearchComponentProps = {
    RenderChild: React.ReactNode;
};

const SearchComponent: React.FC<SearchComponentProps> = ({
    RenderChild
}) => {
    return (
        <div style={{
            display: "flex",
            width: "100%",
            padding: "0.3125rem 1.25rem",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "0.625rem",
            background: "#243271",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                }}>
                    {RenderChild}
                </div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}
export default SearchComponent;