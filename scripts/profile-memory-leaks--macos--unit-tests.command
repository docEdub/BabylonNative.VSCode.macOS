echo
echo Profiling memory leaks on macOS running UnitTests ...
echo
cd /Users/andy/-/code/BabylonNative.VSCode.macOS
time(xctrace record --template Leaks --launch -- BabylonNative/build/macOS/BabylonNative/Apps/UnitTests/Debug/UnitTests)
echo
echo Profiling memory leaks on iOS device running Playground.app - done
