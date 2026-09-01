import { StyleSheet } from "react-native";
import * as Theme from "./theme";

export const sharedStyles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 4,
    justifyContent: "flex-start",
    backgroundColor: Theme.COLOR_BACKGROUND,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLabel: {
    borderRadius: 100,
    //backgroundColor: Theme.COLOR_BUTTON,
    padding: 10,
    width: 110,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    fontSize: 15,
  },
  itemName: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemNameText: {
    flexShrink: 1,
    fontSize: 16,
  },
  itemNameTextInput: {
    paddingHorizontal: 10,
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    borderWidth: 0,
    borderColor: Theme.COLOR_GRAY_30,
    backgroundColor: Theme.COLOR_BACKGROUND,
    opacity: 0.5,
    justifyContent: "center",
    paddingVertical: 0,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //padding: 2,
    minHeight: 35,
    margin: 0,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    //paddingHorizontal: 10,
    // marginBottom: 5,
    height: 35,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: Theme.COLOR_GRAY_50,
    //paddingHorizontal: 4,
    //paddingTop: 4,
    //paddingBottom: 4,
    //margin: 6,
    textAlign: "center",
    alignSelf: "center",
  },
  editingMiddleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  editingLeftButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  editingRightButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {},
  countText: {
    lineHeight: 22,
    fontSize: 16,
    textAlign: "center",
    alignSelf: "center",
  },
});
