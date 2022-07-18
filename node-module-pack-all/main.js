const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const NODE_MODULES = "node_modules";
const BASE_PATH = "/dev/temp";
const TARGET_PATH = "/dev/temp/module_test2";

const getAllDirs = (dirPath) => {
  console.log("Searching " + dirPath);
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    const isPackageDir =
      files.filter((file) => file === "package.json").length === 1;
    if (isPackageDir) {

      console.log('interval');
      /** 
       * 커맨트 정의. yarn pack --ignore-scripts 몇몇 라이브러리가 package.json에 prepack을 선언하고 있는데, 그때 오류가 발생하여 ignore처리. 
      */
      const packCmd =
        "cd " + dirPath + "; yarn pack --ignore-scripts; mv -Force *.tgz " + TARGET_PATH;
      console.log("found package.json at " + dirPath, packCmd);
      // let child = spawn("powershell.exe", dirPath);
      // child.stdout.on("data",function(data){
      //     console.log("Powershell Data: " + data);
      // });
      // child.stderr.on("data",function(data){
      //     console.log("Powershell Errors: " + data);
      // });
      // child.on("exit",function(){
      //     console.log("Powershell Script finished");
      // });
      // child.stdin.end();
      // const output = execSync(packCmd, { encoding: 'utf-8' });

      // console.log('The output is:' + output);

      // child 프로세스 실행(동기)
      spawnSync(
        packCmd,
        { shell: "powershell.exe", cdw: dirPath },
        (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("stdout", stdout);
          console.log("stderr", stderr);
        }
      );
      
    }

    if (!isPackageDir) {
      const dirs = files.filter((file) =>
        fs.statSync(path.join(dirPath, file)).isDirectory()
      );
      dirs.map((dir) => {
        getAllDirs(path.join(dirPath, dir));
      });
    }
    const hasNodeModules =
      files.filter((file) => file === NODE_MODULES).length === 1;
    if (hasNodeModules) {
      getAllDirs(path.join(dirPath, NODE_MODULES));
    }
  });
};

function spawnTest(packCmd) {
  return new Promise(function(resolve, reject) {
    // 2. spawn을 이용하여 새 프로세스를 만듭니다.
    let process = spawn('bash', { shell: "powershell.exe" });
    // 3. 실행할 명령을 작성합니다.
    // '\n' 은 엔터입니다. terminal 이기 때문에 엔터로 명령어를 입력해야 실행되겠죠?
    const command = 'ls -al \n'; // a: 숨긴 파일까지 , l: 자세한 내용까지 검색
    try {
      // 4. 부모 프로세서에서 자식프로세서로 명령을 보냅니다.
      process.stdin.write(packCmd);
      
      // stdin을 이용할때는 end()로 반드시 입력을 끝내야합니다.
      process.stdin.end(); 
      // 5. 명령이 모두 실행됐다면 'close' 이벤트가 발생합니다.
      process.on('close', function (code) {
        console.log('end')
        resolve(code);
      });
    } catch (err) {
      console.log('error')
      reject(err);
    }
  })
 }

getAllDirs(path.join(BASE_PATH, NODE_MODULES));
