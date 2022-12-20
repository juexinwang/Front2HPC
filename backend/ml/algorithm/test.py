from postanalysis_visualW import AnalysisVisualInResult
import base64

def find(imgpaths_list):
    img_list=[]
    print(imgpaths_list)
    for i in imgpaths_list:
        print(i)
        pro = open(i, 'rb')
        data = pro.read()
        img_list.append({'file_name': i, 'file_base64': base64.b64encode(data)})
        pro.close()
    return img_list
analysisvisual = AnalysisVisualInResult(
                                        num_residues=77,
                                        threshold=0.6,
                                        fileDir='/home/hy/Desktop/websever/store/v1/backend/ml/jobs/1220AAAK/logs/',
                                        outputDir='/home/hy/Desktop/websever/store/v1/backend/ml/jobs/1220AAAK/analysis/',
                                        domainInput='A_0_12'
                                        )

imgpaths = analysisvisual.compute()
img_list=find(imgpaths)
print(img_list[1])
