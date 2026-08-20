import { useInventory } from "@/components/InventoryProvider";
import {
  InventorySettingsItem,
  InventorySettingsSectionHeader,
} from "@/components/InventorySettings";
import { sharedStyles } from "@/theme/styles";
import React, { ComponentProps, useCallback, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Animated, {
  DerivedValue,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const DRAGGABLE_ROW_HEIGHT = 35;

function DraggableItemRow({
  id,
  index,
  draggingItemIndex,
  maxIndex,
  dragTranslateY,
  dragCalculatedIndex,
  style,
  children,
}: {
  id: string;
  index: number;
  draggingItemIndex: number;
  maxIndex: number;
  dragTranslateY: SharedValue<number>;
  dragCalculatedIndex: DerivedValue<number>;
  style: ComponentProps<typeof Animated.View>["style"];
  children: React.ReactNode;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    /*    console.log(
      `index=${index} draggingItemIndex=${draggingItemIndex} dragCalculatedIndex=${dragCalculatedIndex.value}`,
    );*/

    if (draggingItemIndex === index) {
      const draggedItemY = Math.min(
        maxIndex * DRAGGABLE_ROW_HEIGHT,
        Math.max(
          DRAGGABLE_ROW_HEIGHT,
          draggingItemIndex * DRAGGABLE_ROW_HEIGHT + dragTranslateY.value,
        ),
      );
      return {
        transform: [
          {
            translateY: draggedItemY,
          },
          {
            translateX: withTiming(10, { duration: 200 }),
          },
        ],
      };
    }

    const shift =
      draggingItemIndex === -1
        ? 0
        : draggingItemIndex < index
          ? dragCalculatedIndex.value >= index
            ? -1
            : 0
          : dragCalculatedIndex.value <= index
            ? 1
            : 0;
    return {
      transform: [
        {
          translateY: withTiming((index + shift) * DRAGGABLE_ROW_HEIGHT, {
            duration: 200,
          }),
        },
        {
          translateX: withTiming(0, { duration: 200 }),
        },
      ],
    };
  }, [index, draggingItemIndex]);

  const onLayout = useCallback(() => {
    dragTranslateY.value = 0;
  }, []);

  return (
    <Animated.View
      key={id}
      style={[styles.draggableItemRow, style, animatedStyle]}
      onLayout={onLayout}
    >
      {children}
    </Animated.View>
  );
}

export default function InventorySettings() {
  const inventoryContext = useInventory();

  const handleAddNewItemToSection = useCallback((sectionId: string) => {
    inventoryContext.addNewItem(sectionId, "");
  }, []);

  const handleRemoveItem = useCallback((itemId: string) => {
    inventoryContext.removeItem(itemId);
  }, []);

  const handleMoveItem = useCallback(
    (itemId: string, direction: "up" | "down") => {
      inventoryContext.moveItem(itemId, direction);
    },
    [],
  );

  const handleItemNameChanged = useCallback(
    (itemId: string, itemName: string) => {
      inventoryContext.renameItem(itemId, itemName);
    },
    [],
  );

  const handleItemCountChanged = useCallback(
    (itemId: string, itemCount: number) => {
      inventoryContext.updateItemCount(itemId, "desiredCount", itemCount);
    },
    [],
  );

  const [draggingItemIndex, setDraggingItemIndex] = useState<number>(-1);

  const dragTranslateY = useSharedValue<number>(0);

  const dragCalculatedIndex = useDerivedValue(() => {
    return Math.max(
      1,
      draggingItemIndex + Math.round(dragTranslateY.value / 35),
    );
  });

  const handleDragStart = useCallback(
    (itemId: string) => {
      console.log("Drag Start");
      setDraggingItemIndex(
        inventoryContext.inventory.rows.findIndex(
          (value) => value.id === itemId,
        ),
      );
    },
    [inventoryContext.inventory.rows],
  );

  const handleDragEnd = useCallback(() => {
    const destInsertIndex = Math.min(
      inventoryContext.inventory.rows.length - 1,
      Math.max(1, dragCalculatedIndex.value),
    );
    console.log(`Drag End ${draggingItemIndex}->${destInsertIndex}`);
    setDraggingItemIndex(-1);
    inventoryContext.moveItemByIndex(draggingItemIndex, destInsertIndex);
  }, [draggingItemIndex, inventoryContext.inventory.rows]);

  return (
    <SafeAreaView style={sharedStyles.page}>
      <ScrollView
        contentContainerStyle={{
          height: DRAGGABLE_ROW_HEIGHT * inventoryContext.inventory.rows.length,
        }}
      >
        {inventoryContext.inventory.rows.map((row, index) =>
          row.type === "section" ? (
            <DraggableItemRow
              key={row.id}
              id={row.id}
              index={index}
              draggingItemIndex={draggingItemIndex}
              maxIndex={inventoryContext.inventory.rows.length}
              dragTranslateY={dragTranslateY}
              dragCalculatedIndex={dragCalculatedIndex}
              style={sharedStyles.sectionTitleContainer}
            >
              <InventorySettingsSectionHeader
                id={row.id}
                name={row.name}
                onAddNewItem={handleAddNewItemToSection}
              />
            </DraggableItemRow>
          ) : (
            <DraggableItemRow
              key={row.id}
              id={row.id}
              index={index}
              draggingItemIndex={draggingItemIndex}
              maxIndex={inventoryContext.inventory.rows.length - 1}
              dragTranslateY={dragTranslateY}
              dragCalculatedIndex={dragCalculatedIndex}
              style={sharedStyles.itemContainer}
            >
              <InventorySettingsItem
                itemId={row.id}
                itemName={row.name}
                itemCount={row.desiredCount}
                onChangeItemCount={handleItemCountChanged}
                onChangeItemName={handleItemNameChanged}
                onMove={handleMoveItem}
                onRemove={handleRemoveItem}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                dragTranslateY={dragTranslateY}
              />
            </DraggableItemRow>
          ),
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  draggableItemRow: {
    position: "absolute",
    height: 35,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
