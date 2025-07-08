
cmake_minimum_required(VERSION 3.18)
project(BabylonNative.vscode)

# This is needed to build the Playground app.
set(BABYLON_NATIVE_BUILD_APPS ON)

# The webp feature takes a long time to configure and build, so it's disabled to save time.
set(BABYLON_NATIVE_PLUGIN_NATIVEENGINE_WEBP OFF)

add_subdirectory("BabylonNative")

set_property(TARGET Playground PROPERTY XCODE_ATTRIBUTE_PRODUCT_BUNDLE_IDENTIFIER "${BABYLON_NATIVE_PLAYGROUND_IOS_PRODUCT_BUNDLE_IDENTIFIER}")
# set_property(TARGET ValidationTests PROPERTY XCODE_ATTRIBUTE_PRODUCT_BUNDLE_IDENTIFIER "${BABYLON_NATIVE_VALIDATION_TESTS_IOS_PRODUCT_BUNDLE_IDENTIFIER}")
