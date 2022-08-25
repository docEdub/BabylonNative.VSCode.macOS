echo
echo Profiling memory leaks on iOS device running Playground.app ...
echo
cd /Users/andy/-/code/BabylonNative.VSCode.macOS
time(xctrace record --template Leaks --device 00008101-000935CE0E43001E --launch -- BabylonNative/build/iOS/BabylonNative/Apps/Playground/Debug-iphoneos/Playground.app)
echo
echo Profiling memory leaks on iOS device running Playground.app - done
