import { useInventory } from "@/components/InventoryProvider";
import {
  InventorySettingsItem,
  InventorySettingsSectionHeader,
} from "@/components/InventorySettings";
import { sharedStyles } from "@/theme/styles";
import React, { ComponentProps, useCallback, useState } from "react";
import { ReactNativeElement, StyleSheet } from "react-native";
import Animated, {
  AnimatedRef,
  clamp,
  DerivedValue,
  measure,
  scrollTo,
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useFrameCallback,
  useScrollOffset,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const DRAGGABLE_ROW_HEIGHT = 35;
const SCROLL_VIEW_AUTOSCROLL_AREA_SIZE = 70;
const SCROLL_VIEW_AUTOSCROLL_SPEED = 1; // scroll units per millisecond

function DraggableItemRow({
  id,
  index,
  draggingItemIndex,
  maxIndex,
  dragY,
  dragRelativeY,
  dragTranslateY,
  dragCalculatedIndex,
  scrollViewRef,
  style,
  children,
}: {
  id: string;
  index: number;
  draggingItemIndex: number;
  maxIndex: number;
  dragY: SharedValue<number>;
  dragRelativeY: DerivedValue<number>;
  dragTranslateY: DerivedValue<number>;
  dragCalculatedIndex: DerivedValue<number>;
  scrollViewRef: AnimatedRef<ReactNativeElement>;
  style: ComponentProps<typeof Animated.View>["style"];
  children: React.ReactNode;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    /*    console.log(
      `index=${index} draggingItemIndex=${draggingItemIndex} dragCalculatedIndex=${dragCalculatedIndex.value}`,
    );*/

    if (draggingItemIndex === index) {
      return {
        transform: [
          {
            translateY: clamp(
              dragRelativeY.value - dragTranslateY.value,
              DRAGGABLE_ROW_HEIGHT,
              maxIndex * DRAGGABLE_ROW_HEIGHT,
            ),
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

  return (
    <Animated.View
      key={id}
      style={[styles.draggableItemRow, style, animatedStyle]}
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
  const dragY = useSharedValue<number>(0);

  const scrollViewRef = useAnimatedRef();
  const scrollViewOffsetY = useScrollOffset(scrollViewRef);

  // Drag Y value relative to scrollview virtual layout
  const dragRelativeY = useDerivedValue(() => {
    const _measure = measure(scrollViewRef);
    const scrollViewPageY = _measure != null ? _measure.pageY : 0;
    return dragY.value - scrollViewPageY + scrollViewOffsetY.value;
  });

  const dragCalculatedIndex = useDerivedValue(() => {
    const _measure = measure(scrollViewRef);
    const scrollViewPageY = _measure != null ? _measure.pageY : 0;
    return Math.max(
      1,
      Math.floor(
        (dragY.value - scrollViewPageY + scrollViewOffsetY.value) /
          DRAGGABLE_ROW_HEIGHT,
      ),
    );
  });

  const frameCallback = useFrameCallback((frameInfo) => {
    const _measure = measure(scrollViewRef);
    const scrollViewPageY = _measure != null ? _measure.pageY : 0;
    const scrollViewHeight = _measure != null ? _measure.height : 100000;
    const delta_t = frameInfo.timeSincePreviousFrame ?? 0;
    const dy = Math.max(0, Math.max(0, dragY.value) - scrollViewPageY);
    console.log(`dy=${dy} dt=${delta_t}`);
    if (dy < SCROLL_VIEW_AUTOSCROLL_AREA_SIZE) {
      scrollTo(
        scrollViewRef,
        0,
        Math.max(
          0,
          scrollViewOffsetY.value -
            (SCROLL_VIEW_AUTOSCROLL_SPEED *
              delta_t *
              (SCROLL_VIEW_AUTOSCROLL_AREA_SIZE - dy)) /
              SCROLL_VIEW_AUTOSCROLL_AREA_SIZE,
        ),
        false,
      );
    }
    if (dy > scrollViewHeight - SCROLL_VIEW_AUTOSCROLL_AREA_SIZE) {
      const bottomDistance = scrollViewHeight - dy;
      scrollTo(
        scrollViewRef,
        0,
        Math.max(
          0,
          scrollViewOffsetY.value +
            (SCROLL_VIEW_AUTOSCROLL_SPEED *
              delta_t *
              (SCROLL_VIEW_AUTOSCROLL_AREA_SIZE - bottomDistance)) /
              SCROLL_VIEW_AUTOSCROLL_AREA_SIZE,
        ),
        false,
      );
    }
  }, false); // false = don't autostart

  const handleDragStart = useCallback(
    (itemId: string) => {
      console.log("Drag Start");
      setDraggingItemIndex(
        inventoryContext.inventory.rows.findIndex(
          (value) => value.id === itemId,
        ),
      );
      frameCallback.setActive(true);
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
    frameCallback.setActive(false);
  }, [draggingItemIndex, inventoryContext.inventory.rows]);

  return (
    <SafeAreaView style={sharedStyles.page} edges={["right", "top", "left"]}>
      <Animated.ScrollView
        ref={scrollViewRef}
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
              dragY={dragY}
              dragRelativeY={dragRelativeY}
              dragTranslateY={dragTranslateY}
              dragCalculatedIndex={dragCalculatedIndex}
              scrollViewRef={scrollViewRef}
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
              dragY={dragY}
              dragRelativeY={dragRelativeY}
              dragTranslateY={dragTranslateY}
              dragCalculatedIndex={dragCalculatedIndex}
              scrollViewRef={scrollViewRef}
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
                dragTranslationY={dragTranslateY}
                dragY={dragY}
              />
            </DraggableItemRow>
          ),
        )}
      </Animated.ScrollView>
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
