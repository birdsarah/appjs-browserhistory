cmd_Release/appjs.node := ln -f "Release/obj.target/appjs.node" "Release/appjs.node" 2>/dev/null || (rm -rf "Release/appjs.node" && cp -af "Release/obj.target/appjs.node" "Release/appjs.node")
